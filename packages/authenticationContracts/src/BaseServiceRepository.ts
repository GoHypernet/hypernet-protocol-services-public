import { ICryptoUtils } from "@hypernetlabs/common-crypto-utils";
import {
	DatabaseError,
	EService,
	InvalidSignatureError,
	JWKSError,
	RedisError,
	SignedResult,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken, UnixTimestamp } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { injectable, unmanaged } from "inversify";
import * as jwt from "jsonwebtoken";
import { ServiceBroker } from "moleculer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import hash from "object-hash";

import {
	GetServiceNonce,
	SubmitSignedServiceNonce,
} from "@authenticationContracts/actions";
import { ISecurityConfigProvider } from "@authenticationContracts/ISecurityConfigProvider";

@injectable()
export abstract class BaseServiceRepository {
	protected serviceToken: JsonWebToken | undefined;
	protected expirationDate: UnixTimestamp;

	public constructor(
		@unmanaged() protected service: EService,
		@unmanaged() protected serviceBroker: ServiceBroker,
		@unmanaged() protected cryptoUtils: ICryptoUtils,
		@unmanaged() protected securityConfigProvider: ISecurityConfigProvider,
	) {
		this.expirationDate = UnixTimestamp(0);
	}

	public getServiceNonce(
		request: GetServiceNonce,
	): ResultAsync<string, RedisError | UnauthorizedError> {
		return ResultAsync.fromPromise(
			this.serviceBroker.call(GetServiceNonce.fullActionName, request),
			(e) => {
				return e as RedisError | UnauthorizedError;
			},
		);
	}

	public submitSignedServiceNonce(
		request: SubmitSignedServiceNonce,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError> {
		return ResultAsync.fromPromise(
			this.serviceBroker.call(
				SubmitSignedServiceNonce.fullActionName,
				request,
			),
			(e) => {
				return e as RedisError | InvalidSignatureError;
			},
		);
	}

	public getServiceToken(): ResultAsync<
		JsonWebToken,
		RedisError | UnauthorizedError | InvalidSignatureError
	> {
		const now = Math.floor(Date.now() / 1000);

		// Check if we can return the cached service token
		if (this.serviceToken != null && now < this.expirationDate) {
			return okAsync(this.serviceToken);
		}

		// The existing token either does not exist or is expired
		return this.securityConfigProvider.getConfig().andThen((config) => {
			return this.getServiceNonce(new GetServiceNonce(config.serviceType))
				.andThen((nonce) => {
					// We need to sign the nonce
					return this.cryptoUtils.signMessage(
						nonce,
						config.serviceKey,
					);
				})
				.andThen((signature) => {
					// Submit the signed nonce we get a JWT Service Token back
					return this.submitSignedServiceNonce(
						new SubmitSignedServiceNonce(
							config.serviceType,
							signature,
						),
					);
				})
				.map((serviceToken) => {
					// Store the token for cache, and then return it
					this.serviceToken = serviceToken;

					const decoded = jwt.decode(serviceToken, {
						complete: true,
					});

					this.expirationDate = UnixTimestamp(
						(decoded.payload as jwt.JwtPayload).exp,
					);

					return serviceToken;
				});
		});
	}

	protected secureServiceCall<TRequest, TResult, TError>(
		userContext: UserContext,
		request: TRequest,
		fullActionName: string,
		service: EService | null = null,
	): ResultAsync<
		TResult,
		RedisError | UnauthorizedError | InvalidSignatureError | TError
	> {
		// Use the default service unless we provided an override
		if (service == null) {
			service = this.service;
		}
		return this.getServiceToken()
			.andThen((serviceToken) => {
				return ResultAsync.fromPromise<SignedResult<TResult>, TError>(
					this.serviceBroker.call(fullActionName, request, {
						requestID: userContext.requestId,
						// parentID: userContext.parentId, // TODO: some references to this in the docs, but not in the actual code.
						// Create a new UserContext, to makes sure the resolved values don't get sent (dead weight),
						// and to update the service token. The user token stays with us as well as the delegation token,
						// but this call is coming from the new service even if it's in a chain.
						meta: {
							user: new UserContext(
								userContext.requestId,
								userContext.parentId,
								userContext.userToken,
								serviceToken,
								userContext.delegationTokens,
							),
						},
					}),
					(e) => {
						return e as TError;
					},
				);
			})
			.andThen((response) => {
				// object-hash has issues with undefined, but not with null. The provided signature will be for "null"
				if (response.result == undefined) {
					response.result = null;
				}

				// Verify the signature of the response
				const responseHash = hash(response.result);
				return ResultUtils.combine([
					this.cryptoUtils.verifySignature(
						responseHash,
						response.signature,
					),
					this.securityConfigProvider.getConfig(),
				]).andThen(([verifiedAddress, config]) => {
					// Make sure the address matches the service!
					const serviceAccountAddress =
						config.serviceAccountAddresses.get(service);
					if (serviceAccountAddress == null) {
						throw new Error(
							`Configuration errror! ${service} does not have a registered service account address!`,
						);
					}

					if (serviceAccountAddress != verifiedAddress) {
						return errAsync(
							new InvalidSignatureError(
								`Service ${service} returned an invalid signature on response to action ${fullActionName}. Returned signature was for account ${verifiedAddress}, but the configured address for the service is ${serviceAccountAddress}. This could be an invalid configuration or it could malicious activity!`,
							),
						);
					}
					return okAsync(response.result);
				});
			});
	}
}
