import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	BaseServiceRepository,
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	EService,
	BucketUnavailableError,
	DatabaseError,
	UrlString,
	UserContext,
	IPFSContentIdentifier,
	InvalidSignatureError,
	RedisError,
	UnauthorizedError,
	UnknownEntityError,
	IPFSUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	CreateUploadLocation,
	GetUploadLink,
	PinFile,
} from "@ipfsContracts/actions";
import { inject, injectable } from "inversify";
import { ServiceBroker } from "moleculer";
import { ServiceBrokerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

import { IIPFSServiceRepository } from "@ipfsContracts/IIPFSServiceRepository";
import { File, UploadLocation } from "@ipfsContracts/objects";

@injectable()
export class IPFSServiceRepository
	extends BaseServiceRepository
	implements IIPFSServiceRepository
{
	public constructor(
		@inject(ServiceBrokerType) serviceBroker: ServiceBroker,
		@inject(ICryptoUtilsType) cryptoUtils: ICryptoUtils,
		@inject(ISecurityConfigProviderType)
		securityConfigProvider: ISecurityConfigProvider,
	) {
		super(
			EService.IPFS,
			serviceBroker,
			cryptoUtils,
			securityConfigProvider,
		);
	}

	public createUploadLocation(
		userContext: UserContext,
		request: CreateUploadLocation,
	): ResultAsync<
		UploadLocation,
		| DatabaseError
		| IPFSUnavailableError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
	> {
		return this.secureServiceCall(
			userContext,
			request,
			CreateUploadLocation.fullActionName,
		);
	}

	public getUploadLink(
		userContext: UserContext,
		request: GetUploadLink,
	): ResultAsync<
		UrlString,
		| DatabaseError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
		| BucketUnavailableError
		| UnknownEntityError
	> {
		return this.secureServiceCall(
			userContext,
			request,
			GetUploadLink.fullActionName,
		);
	}

	public pinFile(
		userContext: UserContext,
		request: PinFile,
	): ResultAsync<
		File,
		| BucketUnavailableError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
	> {
		return this.secureServiceCall(
			userContext,
			request,
			PinFile.fullActionName,
		);
	}
}
