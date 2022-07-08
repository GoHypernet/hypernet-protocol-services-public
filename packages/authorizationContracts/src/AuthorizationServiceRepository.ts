import { GetIdentityKey } from "@authorizationContracts/actions";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import { AESKey } from "@hypernetlabs/common-objects";
import {
	BaseServiceRepository,
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	DatabaseError,
	EService,
	InvalidSignatureError,
	JWKSError,
	RedisError,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { ServiceBroker } from "moleculer";
import { ServiceBrokerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

import { IAuthorizationServiceRepository } from "@authorizationContracts/IAuthorizationServiceRepository";

@injectable()
export class AuthorizationServiceRepository
	extends BaseServiceRepository
	implements IAuthorizationServiceRepository
{
	public constructor(
		@inject(ServiceBrokerType) serviceBroker: ServiceBroker,
		@inject(ICryptoUtilsType) cryptoUtils: ICryptoUtils,
		@inject(ISecurityConfigProviderType)
		securityConfigProvider: ISecurityConfigProvider,
	) {
		super(
			EService.Authorization,
			serviceBroker,
			cryptoUtils,
			securityConfigProvider,
		);
	}

	public getIdentityKey(
		userContext: UserContext,
		request: GetIdentityKey,
	): ResultAsync<
		AESKey,
		| UnauthorizedError
		| DatabaseError
		| JWKSError
		| RedisError
		| InvalidSignatureError
	> {
		return this.secureServiceCall(
			userContext,
			request,
			GetIdentityKey.fullActionName,
		);
	}
}
