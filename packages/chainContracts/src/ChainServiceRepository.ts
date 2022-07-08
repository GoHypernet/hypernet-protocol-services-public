import {
	MintIdentityToken,
	MintProfileToken,
	GetIdentityToken,
	GetProfileToken,
	EstablishEscrowWallet,
	GetProfileTokenByUsername,
	MintRegistryToken,
	CheckRegistryNameExistence,
	CreateRegistry,
	GetChainStatus,
} from "@chainContracts/actions";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	MintedIdentityToken,
	MintedProfileToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	BaseServiceRepository,
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	BlockchainUnavailableError,
	DatabaseError,
	EService,
	EthereumReadError,
	InvalidIdentityTokenError,
	InvalidSignatureError,
	JWKSError,
	MintingDeniedError,
	QueueError,
	RedisError,
	UnauthorizedError,
	UnknownEntityError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import {
	ChainId,
	EthereumContractAddress,
	NonFungibleRegistryContractError,
	RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ServiceBroker } from "moleculer";
import { ServiceBrokerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

import { getChainInfoByChainId } from "@chainContracts/chainInfo";
import { EscrowWallet } from "@chainContracts/EscrowWallet";
import { IChainServiceRepository } from "@chainContracts/IChainServiceRepository";
import { ChainStatus } from "@chainContracts/ChainStatus";

@injectable()
export class ChainServiceRepository
	extends BaseServiceRepository
	implements IChainServiceRepository
{
	public constructor(
		@inject(ServiceBrokerType) serviceBroker: ServiceBroker,
		@inject(ICryptoUtilsType) cryptoUtils: ICryptoUtils,
		@inject(ISecurityConfigProviderType)
		securityConfigProvider: ISecurityConfigProvider,
	) {
		super(
			EService.TestChain, // TODO: This is a problem!
			serviceBroker,
			cryptoUtils,
			securityConfigProvider,
		);
	}

	public mintIdentityToken(
		userContext: UserContext,
		request: MintIdentityToken,
		chainId: ChainId,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| InvalidIdentityTokenError
		| InvalidSignatureError
		| UnauthorizedError
		| DatabaseError
		| JWKSError
		| RedisError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${MintIdentityToken.actionName}`,
			chainInfo.service,
		);
	}

	public mintProfileToken(
		userContext: UserContext,
		request: MintProfileToken,
		chainId: ChainId,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| InvalidIdentityTokenError
		| InvalidSignatureError
		| UnauthorizedError
		| DatabaseError
		| JWKSError
		| RedisError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${MintProfileToken.actionName}`,
			chainInfo.service,
		);
	}

	public getIdentityToken(
		userContext: UserContext,
		request: GetIdentityToken,
		chainId: ChainId,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| RedisError
		| InvalidIdentityTokenError
		| InvalidSignatureError
		| UnauthorizedError
		| DatabaseError
		| JWKSError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${GetIdentityToken.actionName}`,
			chainInfo.service,
		);
	}

	public getProfileToken(
		userContext: UserContext,
		request: GetProfileToken,
		chainId: ChainId,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| RedisError
		| InvalidIdentityTokenError
		| InvalidSignatureError
		| UnauthorizedError
		| DatabaseError
		| JWKSError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${GetProfileToken.actionName}`,
			chainInfo.service,
		);
	}

	public getProfileTokenByUsername(
		userContext: UserContext,
		request: GetProfileTokenByUsername,
		chainId: ChainId,
	): ResultAsync<
		MintedProfileToken,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| RedisError
		| InvalidSignatureError
		| UnauthorizedError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${GetProfileTokenByUsername.actionName}`,
			chainInfo.service,
		);
	}

	public establishEscrowWallet(
		userContext: UserContext,
		request: EstablishEscrowWallet,
		chainId: ChainId,
	): ResultAsync<
		EscrowWallet,
		RedisError | InvalidSignatureError | UnauthorizedError | DatabaseError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${EstablishEscrowWallet.actionName}`,
			chainInfo.service,
		);
	}

	public mintRegistryToken(
		userContext: UserContext,
		request: MintRegistryToken,
		chainId: ChainId,
	): ResultAsync<
		EscrowWallet,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| RedisError
		| QueueError
		| MintingDeniedError
		| DatabaseError
		| UnknownEntityError
		| InvalidSignatureError
		| UnauthorizedError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${MintRegistryToken.actionName}`,
			chainInfo.service,
		);
	}

	public checkRegistryNameExistence(
		userContext: UserContext,
		request: CheckRegistryNameExistence,
		chainId: ChainId,
	): ResultAsync<
		boolean,
		| BlockchainUnavailableError
		| RedisError
		| InvalidSignatureError
		| UnauthorizedError
		| RegistryFactoryContractError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${CheckRegistryNameExistence.actionName}`,
			chainInfo.service,
		);
	}

	public createRegistry(
		userContext: UserContext,
		request: CreateRegistry,
		chainId: ChainId,
	): ResultAsync<
		EthereumContractAddress,
		| BlockchainUnavailableError
		| RedisError
		| InvalidSignatureError
		| UnauthorizedError
		| DatabaseError
		| RegistryFactoryContractError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${CreateRegistry.actionName}`,
			chainInfo.service,
		);
	}

	public getChainStatus(
		userContext: UserContext,
		request: GetChainStatus,
		chainId: ChainId,
	): ResultAsync<
		ChainStatus,
		| DatabaseError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
		| UnauthorizedError
		| RedisError
		| InvalidSignatureError
	> {
		const chainInfo = getChainInfoByChainId(chainId);
		return this.secureServiceCall(
			userContext,
			request,
			`${chainInfo.service}.${GetChainStatus.actionName}`,
			chainInfo.service,
		);
	}
}
