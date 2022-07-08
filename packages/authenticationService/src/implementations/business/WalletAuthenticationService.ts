import {
	TypedDataDomain,
	TypedDataField,
} from "@ethersproject/abstract-signer";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	IRedisProviderType,
	IRedisProvider,
	RedisError as RedisProviderError,
} from "@hypernetlabs/common-redis-provider";
import {
	CorporatePermissions,
	GetCorporatePermissions,
	ICorporateServiceRepository,
	ICorporateServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-corporate-contracts";
import {
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	AssureIdentityForAccount,
	IIdentityServiceRepository,
	IIdentityServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-identity-contracts";
import {
	DatabaseError,
	EService,
	IdentityId,
	InvalidSignatureError,
	Nonce,
	RedisError,
	ReferralLinkId,
	ResolvedUserContext,
	UnauthorizedError,
	WalletTokenIssuedEvent,
} from "@hypernetlabs/hypernet.id-objects";
import {
	IConcurrencyUtils,
	IConcurrencyUtilsType,
} from "@hypernetlabs/hypernet.id-utils";
import {
	EthereumAccountAddress,
	JsonWebToken,
	Signature,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
	CAMPAIGN_ACCOUNT_VERIFICATION_MESSAGE,
	KYC_ACCOUNT_VERIFICATION_MESSAGE,
} from "@authentication/constants";
import { IWalletAuthenticationService } from "@authentication/interfaces/business";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@authentication/interfaces/utils";
import { IUserTokenPayload } from "@authenticationContracts/interfaces/objects";

@injectable()
export class WalletAuthenticationService
	implements IWalletAuthenticationService
{
	protected domain: TypedDataDomain;
	protected types: Record<string, TypedDataField[]>;
	public constructor(
		@inject(IIdentityServiceRepositoryType)
		protected identityServiceRepo: IIdentityServiceRepository,
		@inject(ICorporateServiceRepositoryType)
		protected corporateServiceRepo: ICorporateServiceRepository,
		@inject(IConcurrencyUtilsType)
		protected concurrencyUtils: IConcurrencyUtils,
		@inject(IEventRepositoryType) protected eventRepo: IEventRepository,
		@inject(IRedisProviderType) protected redisProvider: IRedisProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
	) {
		this.domain = {
			name: "Hypernet Protocol",
			version: "1",
		};
		this.types = {
			AuthorizedGateway: [
				{ name: "Message", type: "string" },
				{ name: "Nonce", type: "string" },
			],
		};
	}

	public getCurrentNonce(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<string, RedisError> {
		return this.redisProvider.getRedisClient().andThen((redisClient) => {
			const nonceKey = this.getGetNonceKey(accountAddress);

			return redisClient
				.get(nonceKey)
				.mapErr(this.toRedisError)
				.andThen((existingNonce) => {
					// If there is a nonce already, return it
					if (existingNonce != null) {
						return okAsync(existingNonce);
					}

					// No existing nonce, we'll create it. The nonce is good for config.nonceLifetime seconds
					return ResultUtils.combine([
						this.cryptoUtils.getNonce(),
						this.configProvider.getConfig(),
					]).andThen((vals) => {
						const [nonce, config] = vals;
						return redisClient
							.set(nonceKey, nonce, config.nonceLifetime)
							.mapErr(this.toRedisError)
							.map(() => {
								return nonce;
							});
					});
				});
		});
	}

	public getCurrentServiceNonce(
		service: EService,
	): ResultAsync<string, RedisError | UnauthorizedError> {
		return ResultUtils.combine([
			this.redisProvider.getRedisClient(),
			this.configProvider.getConfig(),
		]).andThen(([redisClient, config]) => {
			return this.concurrencyUtils.performWithLock(
				`getCurrentServiceNonce.${service}`,
				() => {
					const serviceAccountAddress =
						config.serviceAccountAddresses.get(service);
					if (serviceAccountAddress == null) {
						return errAsync<string, RedisError | UnauthorizedError>(
							new UnauthorizedError(`Unknown service ${service}`),
						);
					}
					const nonceKey = this.getGetNonceKey(serviceAccountAddress);

					return redisClient
						.get(nonceKey)
						.mapErr((e) => {
							return new RedisError(e.message, e);
						})
						.andThen((existingNonce) => {
							// If there is a nonce already, return it
							if (existingNonce != null) {
								return okAsync(existingNonce);
							}

							// No existing nonce, we'll create it. The nonce is good for config.nonceLifetime seconds
							return this.cryptoUtils
								.getNonce()
								.andThen((nonce) => {
									return redisClient
										.set(
											nonceKey,
											nonce,
											config.nonceLifetime,
										)
										.mapErr((e) => {
											return new RedisError(e.message, e);
										})
										.map(() => {
											return nonce;
										});
								});
						});
				},
			);
		});
	}

	public getMessage(referralLinkId?: ReferralLinkId): string {
		return referralLinkId
			? CAMPAIGN_ACCOUNT_VERIFICATION_MESSAGE
			: KYC_ACCOUNT_VERIFICATION_MESSAGE;
	}

	public submitSignedNonce(
		context: ResolvedUserContext,
		accountAddress: EthereumAccountAddress,
		signature: Signature,
		referralLinkId?: ReferralLinkId,
		nftNonce?: Nonce,
	): ResultAsync<
		JsonWebToken,
		RedisError | UnauthorizedError | InvalidSignatureError | DatabaseError
	> {
		return this.redisProvider
			.getRedisClient()
			.andThen((redisClient) => {
				return redisClient
					.get(this.getGetNonceKey(accountAddress))
					.mapErr(this.toRedisError);
			})
			.andThen((nonce) => {
				if (nonce == null) {
					return errAsync<
						EthereumAccountAddress,
						InvalidSignatureError
					>(
						new InvalidSignatureError(
							`Nonce is no longer valid. Signature must be obtained in under config.nonceLifetime seconds`,
						),
					);
				}

				// Nonce is still around
				const value = {
					Message: this.getMessage(referralLinkId),
					Nonce: nonce,
				};
				return this.cryptoUtils.verifyTypedData(
					this.domain,
					this.types,
					value,
					signature,
				);
			})
			.andThen((verifiedAccountAddress) => {
				if (verifiedAccountAddress != accountAddress) {
					return errAsync(
						new InvalidSignatureError(
							"Signature verification failed",
						),
					);
				}

				// Now we will send an action to assure an identity exists for this account.
				return this.identityServiceRepo.assureIdentityForAccount(
					context,
					new AssureIdentityForAccount(
						accountAddress,
						nftNonce || null,
					),
				);
			})
			.andThen((identity) => {
				// Go to the corporate service, and check what permissions this identity has.
				return this.corporateServiceRepo
					.getCorporatePermissions(
						context,
						new GetCorporatePermissions([identity.identityId]),
					)
					.andThen((corporatePermissions) => {
						// We can encode all of the corporates that this identity has access to into the token
						return this.createJwt(
							identity.identityId,
							accountAddress,
							corporatePermissions,
							identity.isAdmin,
						);
					})
					.map((token) => {
						// Emit an event that an identity has connected; this is a good one for playing catch up in other services.
						this.eventRepo.walletTokenIssued(
							new WalletTokenIssuedEvent(
								context,
								identity.identityId,
								accountAddress,
							),
						);
						return token;
					});
			});
	}

	public submitSignedServiceNonce(
		service: EService,
		signature: Signature,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError> {
		return ResultUtils.combine([
			this.redisProvider.getRedisClient(),
			this.configProvider.getConfig(),
		]).andThen(([redisClient, config]) => {
			// Get the service account address
			const serviceAccountAddress =
				config.serviceAccountAddresses.get(service);
			if (serviceAccountAddress == null) {
				return errAsync(
					new InvalidSignatureError(`Unknown service ${service}`),
				);
			}
			return redisClient
				.get(this.getGetNonceKey(serviceAccountAddress))
				.mapErr(this.toRedisError)
				.andThen((nonce) => {
					if (nonce == null) {
						return errAsync<
							EthereumAccountAddress,
							InvalidSignatureError
						>(
							new InvalidSignatureError(
								`Nonce is no longer valid. Signature must be obtained in under config.nonceLifetime seconds. Called from service ${service}`,
							),
						);
					}

					// Nonce is still around
					return this.cryptoUtils.verifySignature(nonce, signature);
				})
				.andThen((verifiedAccountAddress) => {
					if (verifiedAccountAddress != serviceAccountAddress) {
						return errAsync(
							new InvalidSignatureError(
								`Service signature verification failed for service ${service}`,
							),
						);
					}

					// Now issue a Service Token
					return this.createServiceJwt(service);
				});
		});
	}

	protected createJwt(
		identityId: IdentityId,
		accountAddress: EthereumAccountAddress,
		corporatePermissions: CorporatePermissions[],
		isAdmin: boolean,
	): ResultAsync<JsonWebToken, InvalidSignatureError> {
		return this.configProvider.getConfig().andThen((config) => {
			return ResultAsync.fromPromise(
				new Promise<JsonWebToken>((resolve, reject) => {
					const cp = corporatePermissions.reduce((prev, cur) => {
						prev[cur.corporateId] = cur.role;
						return prev;
					}, {});

					return jwt.sign(
						{
							accountAddress,
							identityId,
							aud: config.walletTokenAudience,
							corporatePermissions: cp,
							permissions: isAdmin ? ["system:admin"] : null,
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

	protected createServiceJwt(
		service: EService,
	): ResultAsync<JsonWebToken, InvalidSignatureError> {
		return this.configProvider.getConfig().andThen((config) => {
			return ResultAsync.fromPromise(
				new Promise<JsonWebToken>((resolve, reject) =>
					jwt.sign(
						{
							service: service.toString(),
							aud: config.serviceTokenAudience,
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
					),
				),
				(e) => {
					return e as InvalidSignatureError;
				},
			);
		});
	}

	protected getGetNonceKey(accountAddress: EthereumAccountAddress): string {
		return `account.${accountAddress}.nonce`;
	}

	protected toRedisError(e: RedisProviderError): RedisError {
		return new RedisError(e.message, e);
	}
}
