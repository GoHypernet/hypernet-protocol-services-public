import {
	GetIdentityToken,
	GetProfileToken,
	GetProfileTokenByUsername,
	MintIdentityToken,
	MintProfileToken,
	EstablishEscrowWallet,
	MintRegistryToken,
	CheckRegistryNameExistence,
	CreateRegistry,
	GetChainStatus,
} from "@chainContracts/actions";
import {
	MintedIdentityToken,
	MintedProfileToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	BlockchainUnavailableError,
	DatabaseError,
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
import { ResultAsync } from "neverthrow";

import { EscrowWallet } from "@chainContracts/EscrowWallet";
import { ChainStatus } from "@chainContracts/ChainStatus";

export interface IChainServiceRepository {
	/**
	 * Returns a token if it already exists. Kind of counterintuitive.
	 * If it has to mint the token, the new token will be announced via an event.
	 * @param identity
	 * @param accountAddress
	 * @param chainId
	 */
	mintIdentityToken(
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
	>;

	/**
	 * Returns a token if it already exists. Kind of counterintuitive.
	 * If it has to mint the token, the new token will be announced via an event.
	 * @param identityId
	 * @param username
	 * @param accountAddress
	 * @param chainId
	 */
	mintProfileToken(
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
	>;

	getIdentityToken(
		userContext: UserContext,
		request: GetIdentityToken,
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
	>;

	getProfileToken(
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
	>;

	getProfileTokenByUsername(
		userContext: UserContext,
		request: GetProfileTokenByUsername,
		chainId: ChainId,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| RedisError
		| InvalidSignatureError
		| UnauthorizedError
	>;

	establishEscrowWallet(
		userContext: UserContext,
		request: EstablishEscrowWallet,
		chainId: ChainId,
	): ResultAsync<
		EscrowWallet,
		RedisError | InvalidSignatureError | UnauthorizedError | DatabaseError
	>;

	mintRegistryToken(
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
	>;

	checkRegistryNameExistence(
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
	>;

	createRegistry(
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
	>;

	getChainStatus(
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
	>;
}

export const IChainServiceRepositoryType = Symbol.for(
	"IChainServiceRepository",
);
