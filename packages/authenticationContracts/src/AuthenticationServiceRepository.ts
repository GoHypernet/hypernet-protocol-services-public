import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	DatabaseError,
	EService,
	InvalidSignatureError,
	JWKSError,
	ResolvedToken,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ServiceBroker } from "moleculer";
import { ServiceBrokerType } from "moleculer-ioc";
import { ResultAsync, okAsync } from "neverthrow";
import { v4 } from "uuid";

import {
	ExchangeCorporateSecretForToken,
	GetMessage,
	GetNonce,
	ResolveToken,
	SubmitSignedNonce,
} from "@authenticationContracts/actions";
import { BaseServiceRepository } from "@authenticationContracts/BaseServiceRepository";
import { IAuthenticationServiceRepository } from "@authenticationContracts/IAuthenticationServiceRepository";
import {
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@authenticationContracts/ISecurityConfigProvider";

@injectable()
export class AuthenticationServiceRepository
	extends BaseServiceRepository
	implements IAuthenticationServiceRepository
{
	public constructor(
		@inject(ServiceBrokerType) serviceBroker: ServiceBroker,
		@inject(ICryptoUtilsType) cryptoUtils: ICryptoUtils,
		@inject(ISecurityConfigProviderType)
		securityConfigProvider: ISecurityConfigProvider,
	) {
		super(
			EService.Authentication,
			serviceBroker,
			cryptoUtils,
			securityConfigProvider,
		);
	}
	public exchangeCorporateSecretForToken(
		userContext: UserContext,
		request: ExchangeCorporateSecretForToken,
	): ResultAsync<
		JsonWebToken,
		DatabaseError | UnauthorizedError | InvalidSignatureError | RedisError
	> {
		return this.secureServiceCall(
			userContext,
			request,
			ExchangeCorporateSecretForToken.fullActionName,
		);
	}

	public getNonce(
		userContext: UserContext,
		request: GetNonce,
	): ResultAsync<string, RedisError> {
		return this.secureServiceCall(
			userContext,
			request,
			GetNonce.fullActionName,
		);
	}

	public getMessage(
		userContext: UserContext,
		request: GetMessage,
	): ResultAsync<string, RedisError> {
		return this.secureServiceCall(
			userContext,
			request,
			GetMessage.fullActionName,
		);
	}

	public resolveToken(
		request: ResolveToken,
	): ResultAsync<ResolvedToken, JWKSError> {
		// VERY IMPORTANT
		// Do not use signedActionHandler here or you will get some crazy bad loops, since that method
		// calls ResolveToken!
		return ResultAsync.fromPromise(
			this.serviceBroker.call(ResolveToken.fullActionName, request),
			(e) => {
				return e as JWKSError;
			},
		);
	}

	public submitSignedNonce(
		userContext: UserContext,
		request: SubmitSignedNonce,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError> {
		return this.secureServiceCall(
			userContext,
			request,
			SubmitSignedNonce.fullActionName,
		);
	}

	public getSystemUserContext(): ResultAsync<
		UserContext,
		RedisError | UnauthorizedError | InvalidSignatureError
	> {
		return this.getServiceToken().andThen((serviceToken) => {
			const requestId = v4();
			return okAsync(
				new UserContext(requestId, requestId, null, serviceToken, []),
			);
		});
	}
}
