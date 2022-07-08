import {
	ChainStatus,
	ChainTransaction,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	BlockNumber,
	DatabaseError,
	EncryptionKeyUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	EventError,
	MintBlockchainErrors,
	RedisError,
	TransactionHash,
	UserContext,
	BlockchainUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	ChainId,
	ERC20ContractError,
	NonFungibleRegistryContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChainTransactionService {
	getByTransactionHash(
		transactionHash: TransactionHash,
	): ResultAsync<ChainTransaction | null, DatabaseError>;

	processBlock(
		userContext: UserContext,
		chainId: ChainId,
		blockNumber: BlockNumber,
	): ResultAsync<
		void,
		| DatabaseError
		| EthereumReadError
		| EthereumWriteError
		| MintBlockchainErrors
		| ERC20ContractError
		| RedisError
		| MintBlockchainErrors
		| NonFungibleRegistryContractError
		| EventError
		| EncryptionKeyUnavailableError
	>;

	getChainHealthStatus(): ResultAsync<
		ChainStatus,
		| DatabaseError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
	>;
}

export const IChainTransactionServiceType = Symbol.for(
	"IChainTransactionService",
);
