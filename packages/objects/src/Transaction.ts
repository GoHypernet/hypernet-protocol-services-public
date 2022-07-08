import { TransactionHash } from "@objects/TransactionHash";
import {
	BigNumberString,
	ChainId,
	EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ETransactionStatus } from "@objects/enum/ETransactionStatus";
import { BlockNumber } from "@objects/BlockNumber";

export class Transaction {
	public constructor(
		public chainId: ChainId,
		public transactionHash: TransactionHash,
		public registryAddress: EthereumContractAddress,
		public maxFeePerGas: BigNumberString | null,
		public maxPriorityFeePerGas: BigNumberString | null,
		public gasLimit: BigNumberString,
		public blockNumber: BlockNumber | null,
		public value: BigNumberString,
		public nonce: number,
		public status: ETransactionStatus,
	) {}
}
