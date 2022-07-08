import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	MintedIdentityToken,
	MintedProfileToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	BlockchainUnavailableError,
	EthereumReadError,
	IdentityDoc,
	IdentityId,
	MintingDeniedError,
	QueueError,
	UserContext,
	UsernameString,
	EthereumWriteError,
	DatabaseError,
	EscrowWalletId,
	UnknownEntityError,
	MintBlockchainErrors,
} from "@hypernetlabs/hypernet.id-objects";
import {
	ERC20ContractError,
	EthereumAccountAddress,
	EthereumAddress,
	EthereumContractAddress,
	NonFungibleRegistryContractError,
	UUID,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMintingService {
	mintIdentityToken(
		userContext: UserContext,
		identity: IdentityDoc,
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| QueueError
		| MintingDeniedError
		| RedisError
		| DatabaseError
	>;

	mintProfileToken(
		userContext: UserContext,
		identityId: IdentityId,
		username: UsernameString,
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedProfileToken | null,
		| EthereumReadError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
		| DatabaseError
		| QueueError
		| RedisError
		| MintingDeniedError
	>;

	mintRegistryToken(
		userContext: UserContext,
		escrowWalletId: EscrowWalletId,
		tokenIdentifier: UUID,
		registryAddress: EthereumContractAddress,
		accountAddress: EthereumAccountAddress,
		label: string | null,
		tokenUri: string | null,
	): ResultAsync<
		void,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| RedisError
		| QueueError
		| MintingDeniedError
		| DatabaseError
		| UnknownEntityError
	>;

	getIdentityToken(
		accountAddress: EthereumAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;

	getProfileToken(
		accountAddress: EthereumAddress,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;

	getProfileTokenByUsername(
		userContext: UserContext,
		username: UsernameString,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;

	doHypernetProfileMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| DatabaseError
		| RedisError
		| MintBlockchainErrors
		| ERC20ContractError
		| EthereumWriteError
	>;

	doIdentityTokenMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| RedisError
		| DatabaseError
		| MintBlockchainErrors
		| EthereumWriteError
	>;

	doRegistryTokenMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| RedisError
		| DatabaseError
		| MintBlockchainErrors
		| EthereumWriteError
	>;
}

export const IMintingServiceType = Symbol.for("IMintingService");
