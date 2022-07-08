import {
	ChainToken,
	ChainTokensToMint,
	NewChainToken,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChainTokenRepository {
	add(
		newChainToken: NewChainToken[],
	): ResultAsync<ChainToken[], DatabaseError>;
	getById(chainTokenId: UUID): ResultAsync<ChainToken | null, DatabaseError>;
	getByChainToken(
		newChainToken: NewChainToken,
	): ResultAsync<ChainToken | null, DatabaseError>;
	getAll(): ResultAsync<ChainToken[], DatabaseError>;
	getByChainTransactionId(
		transactionId: UUID,
	): ResultAsync<ChainToken[], DatabaseError>;
	update(chainToken: ChainToken): ResultAsync<ChainToken, DatabaseError>;
	getChainTokensToMint(): ResultAsync<ChainTokensToMint[], DatabaseError>;
}

export const IChainTokenRepositoryType = Symbol.for("IChainTokenRepository");
