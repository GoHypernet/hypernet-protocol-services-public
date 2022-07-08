import {
	BlockNumber,
	EscrowWalletId,
	ETransactionStatus,
	Transaction,
	TransactionHash,
} from "@hypernetlabs/hypernet.id-objects";
import {
	BigNumberString,
	ChainId,
	EthereumContractAddress,
	UnixTimestamp,
	UUID,
} from "@hypernetlabs/objects";

export class NewChainTransaction extends Transaction {
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
		public escrowWalletId: EscrowWalletId,
	) {
		super(
			chainId,
			transactionHash,
			registryAddress,
			maxFeePerGas,
			maxPriorityFeePerGas,
			gasLimit,
			blockNumber,
			value,
			nonce,
			status,
		);
	}
}

export class ChainTransaction extends NewChainTransaction {
	public constructor(
		public id: UUID,
		chainId: ChainId,
		transactionHash: TransactionHash,
		registryAddress: EthereumContractAddress,
		maxFeePerGas: BigNumberString | null,
		maxPriorityFeePerGas: BigNumberString | null,
		gasLimit: BigNumberString,
		blockNumber: BlockNumber | null,
		value: BigNumberString,
		nonce: number,
		status: ETransactionStatus,
		escrowWalletId: EscrowWalletId,
		public createdTimestamp: UnixTimestamp,
		public updatedTimestamp: UnixTimestamp,
	) {
		super(
			chainId,
			transactionHash,
			registryAddress,
			maxFeePerGas,
			maxPriorityFeePerGas,
			gasLimit,
			blockNumber,
			value,
			nonce,
			status,
			escrowWalletId,
		);
	}
}
