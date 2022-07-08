import {
	BigNumberString,
	ChainId,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";
import {
	EscrowWalletId,
	EChainStatus,
} from "@hypernetlabs/hypernet.id-objects";

export class ChainStatus {
	public constructor(
		public chainId: ChainId,
		public escrowWalletId: EscrowWalletId | null,
		public escrowWalletAccountAddress: EthereumAccountAddress | null,
		public escrowWalletBalance: BigNumberString | null,
		public hasHyperToken: boolean,
		public hasProfileRegistrarRole: boolean,
		public hasIdentityRegistrarRole: boolean,
		public status: EChainStatus,
		public errors: string[],
	) {}
}
