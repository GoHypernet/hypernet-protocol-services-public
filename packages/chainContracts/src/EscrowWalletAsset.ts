import {
	BigNumberString,
	EthereumContractAddress,
	UnixTimestamp,
	UUID,
} from "@hypernetlabs/objects";
import { EscrowWalletId, BlockNumber } from "@hypernetlabs/hypernet.id-objects";

export class NewEscrowWalletAsset {
	public constructor(
		public escrowWalletId: EscrowWalletId,
		public assetAddress: EthereumContractAddress,
		public lastBalance: BigNumberString,
		public blockNumber: BlockNumber,
	) {}
}

export class EscrowWalletAsset extends NewEscrowWalletAsset {
	public constructor(
		public id: UUID,
		escrowWalletId: EscrowWalletId,
		assetAddress: EthereumContractAddress,
		lastBalance: BigNumberString,
		blockNumber: BlockNumber,
		public created_timestamp: UnixTimestamp,
		public updated_timestamp: UnixTimestamp,
	) {
		super(escrowWalletId, assetAddress, lastBalance, blockNumber);
	}
}
