import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	IRedisProviderType,
	IRedisProvider,
} from "@hypernetlabs/common-redis-provider";
import {
	ICorporateServiceRepository,
	ICorporateServiceRepositoryType,
	VerifyActiveCorporateCredentials,
} from "@hypernetlabs/hypernet.id-corporate-contracts";
import {
	CorporateId,
	DatabaseError,
	EAuthenticationTokenType,
	ECorporateRole,
	InvalidSignatureError,
	JWKSError,
	Nonce,
	RedisError,
	ResolvedToken,
	ResolvedUserContext,
	UnauthorizedError,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import jwks from "jwks-rsa";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { ITokenService } from "@authentication/interfaces/business";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@authentication/interfaces/utils";
import { IUserTokenPayload } from "@authenticationContracts/interfaces/objects";

@injectable()
export class TokenService implements ITokenService {
	protected jwksClientResult: ResultAsync<jwks.JwksClient, never> | null;

	public constructor(
		@inject(ICorporateServiceRepositoryType)
		protected corporateServiceRepo: ICorporateServiceRepository,
		@inject(IRedisProviderType) protected redisProvider: IRedisProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
	) {
		this.jwksClientResult = null;
	}

	public exchangeCorporateSecretForToken(
		userContext: ResolvedUserContext,
		corporateId: CorporateId,
		corporateSecret: Nonce,
	): ResultAsync<
		JsonWebToken,
		DatabaseError | UnauthorizedError | InvalidSignatureError | RedisError
	> {
		// We need to hash the corporate secret, and then see if active CorporateCredentials exist
		return this.cryptoUtils
			.hashStringSHA256(corporateSecret)
			.andThen((secretHash) => {
				return this.corporateServiceRepo.verifyActiveCorporateCredentials(
					userContext,
					new VerifyActiveCorporateCredentials(
						corporateId,
						secretHash,
					),
				);
			})
			.andThen((verificationResult) => {
				if (!verificationResult.verified) {
					return errAsync(
						new UnauthorizedError(
							`Invalid corporate secret for corporate ID ${corporateId}`,
						),
					);
				}

				return this.createJwt(corporateId, verificationResult.role);
			});
	}

	public resolveToken(
		token: JsonWebToken,
	): ResultAsync<ResolvedToken, JWKSError> {
		return ResultUtils.combine([
			this.getSigningKey(token),
			this.configProvider.getConfig(),
		]).andThen(([secretKey, config]) => {
			// Verify the token's authenticity
			try {
				const decoded = jwt.verify(token, secretKey, {
					audience: [
						config.walletTokenAudience,
						config.serviceTokenAudience,
						config.auth0Audience,
						config.corporateTokenAudience,
					],
					issuer: [config.tokenIssuer, `${config.auth0Issuer}/`],
					algorithms: ["RS256", "HS256"],
				}) as IUserTokenPayload;
				const isAdmin =
					decoded.permissions?.includes("system:admin") || false;

				if (decoded.iss == config.tokenIssuer) {
					// Check the audience
					if (decoded.aud == config.walletTokenAudience) {
						// It's a user, so it will have an identityId, account address, and maybe some corporate permissions
						return okAsync(
							new ResolvedToken(
								EAuthenticationTokenType.Wallet,
								token,
								decoded.identityId,
								decoded.accountAddress,
								decoded.sub || null,
								null, // service
								null, // corporateId
								decoded.corporatePermissions, // corporatePermissions
								isAdmin,
							),
						);
					} else if (decoded.aud == config.serviceTokenAudience) {
						// It's a service token. It should only include a claim for the service
						return okAsync(
							new ResolvedToken(
								EAuthenticationTokenType.Service,
								token,
								null,
								null,
								null,
								decoded.service,
								null, // corporateId
								{}, // corporatePermissions
								isAdmin,
							),
						);
					} else if (decoded.aud == config.corporateTokenAudience) {
						// It's a service token. It should only include a claim for the service
						return okAsync(
							new ResolvedToken(
								EAuthenticationTokenType.Corporate,
								token,
								null,
								null,
								null,
								decoded.service,
								null, // corporateId
								decoded.corporatePermissions, // corporatePermissions
								isAdmin,
							),
						);
					}

					return okAsync(this.getInvalidResolvedToken(token));
				} else if (decoded.iss == `${config.auth0Issuer}/`) {
					// It's an Auth0 token, so generally this is for Customers
					// It could be either a customer API or a customer person
					return okAsync(
						new ResolvedToken(
							EAuthenticationTokenType.SSO,
							token,
							null,
							null,
							decoded.sub || null, // auth0Id
							null, // service
							null, // corporateId
							{}, // corporatePermissions
							isAdmin,
						),
					);
				} else {
					return okAsync(this.getInvalidResolvedToken(token));
				}
			} catch (e) {
				// This generally happens if the jwt does not verify.
				this.logger.warn(e);
				return okAsync(this.getInvalidResolvedToken(token));
			}
		});
	}

	protected getInvalidResolvedToken(token: JsonWebToken): ResolvedToken {
		return new ResolvedToken(
			EAuthenticationTokenType.Invalid,
			token,
			null,
			null,
			null,
			null,
			null,
			{}, // corporatePermissions
			false,
		);
	}

	protected getSigningKey(
		token: JsonWebToken,
	): ResultAsync<string, JWKSError> {
		const decoded = jwt.decode(token, {
			complete: true,
		});

		if (decoded == null) {
			return errAsync(new JWKSError("Could not decode token!"));
		}

		if (typeof decoded.payload === "string") {
			return errAsync(
				new JWKSError(
					"Could not decode token! Decoded payload is a string!",
				),
			);
		}

		return this.getSigningKeyFromValues(
			decoded.header.kid,
			decoded.payload.iss,
		);
	}

	protected getSigningKeyFromValues(
		keyId: string | undefined,
		issuer: string | undefined,
	): ResultAsync<string, JWKSError> {
		return this.configProvider.getConfig().andThen((config) => {
			if (issuer == config.tokenIssuer) {
				return okAsync(config.tokenSigningKey);
			} else {
				return this.getJwksClient()
					.andThen((jwksClient) => {
						return ResultAsync.fromPromise(
							jwksClient.getSigningKey(keyId),
							(e) => e as JWKSError,
						);
					})
					.map((signingKey) => {
						return signingKey.getPublicKey();
					});
			}
		});
	}

	protected getJwksClient(): ResultAsync<jwks.JwksClient, never> {
		if (this.jwksClientResult == null) {
			this.jwksClientResult = this.configProvider
				.getConfig()
				.map((config) => {
					return new jwks.JwksClient({
						cache: true,
						rateLimit: true,
						jwksRequestsPerMinute: 5,
						jwksUri: config.jwksUrl,
					});
				});
		}

		return this.jwksClientResult;
	}

	protected createJwt(
		corporateId: CorporateId,
		corporateRole: ECorporateRole,
	): ResultAsync<JsonWebToken, InvalidSignatureError> {
		return this.configProvider.getConfig().andThen((config) => {
			return ResultAsync.fromPromise(
				new Promise<JsonWebToken>((resolve, reject) => {
					return jwt.sign(
						{
							aud: config.corporateTokenAudience,
							corporatePermissions: {
								[corporateId]: corporateRole,
							},
						} as IUserTokenPayload,
						config.tokenSigningKey,
						{
							algorithm: "HS256",
							expiresIn: "1h",
							issuer: config.tokenIssuer,
						},
						(err, token) => {
							if (err) {
								return reject(err);
							}
							if (!token) {
								return new InvalidSignatureError("Empty token");
							}
							return resolve(JsonWebToken(token));
						},
					);
				}),
				(e) => {
					return e as InvalidSignatureError;
				},
			);
		});
	}
}
