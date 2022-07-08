import { TransactionHash } from "@hypernetlabs/hypernet.id-objects";

export class GetChainTransactionByTransactionHash {
	public constructor(public transactionHash: TransactionHash) {}

	static actionName = "getChainTransactionByTransactionHash";
}
