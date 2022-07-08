import {
	ChainId,
	EthereumAccountAddress,
	UnixTimestamp,
} from "@hypernetlabs/objects";
import { EscrowWalletId } from "@hypernetlabs/hypernet.id-objects";
export class NewEscrowWallet {
	public constructor(
		public chainId: ChainId,
		public accountAddress: EthereumAccountAddress,
	) {}
}

export class EscrowWallet extends NewEscrowWallet {
	public constructor(
		public id: EscrowWalletId,
		public chainId: ChainId,
		public accountAddress: EthereumAccountAddress,
		public creationTimestamp: UnixTimestamp,
		public updatedTimestamp: UnixTimestamp,
	) {
		super(chainId, accountAddress);
	}
}
