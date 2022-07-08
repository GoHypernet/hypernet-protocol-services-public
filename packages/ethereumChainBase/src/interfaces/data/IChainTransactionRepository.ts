import {
	ChainTransaction,
	NewChainTransaction,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	DatabaseError,
	IdentityId,
	TransactionHash,
} from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChainTransactionRepository {
	add(
		newChainTransactions: NewChainTransaction[],
	): ResultAsync<ChainTransaction[], DatabaseError>;
	getById(
		chainTransactionId: UUID,
	): ResultAsync<ChainTransaction | null, DatabaseError>;
	getAll(): ResultAsync<ChainTransaction[], DatabaseError>;
	getByTransactionHash(
		transactionHash: TransactionHash,
	): ResultAsync<ChainTransaction | null, DatabaseError>;
	getSubmittedTransactions(): ResultAsync<ChainTransaction[], DatabaseError>;
	update(
		chainTransaction: ChainTransaction,
	): ResultAsync<ChainTransaction, DatabaseError>;
}

export const IChainTransactionRepositoryType = Symbol.for(
	"IChainTransactionRepository",
);
