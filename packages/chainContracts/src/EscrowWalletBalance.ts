import {
	AssetAddressBalance,
	EscrowWalletId,
} from "@hypernetlabs/hypernet.id-objects";
import { ChainId, UnixTimestamp } from "@hypernetlabs/objects";

export class EscrowWalletBalance {
	public constructor(
		public escrowWalletId: EscrowWalletId,
		public chainId: ChainId,
		public balances: AssetAddressBalance[],
		public timestamp: UnixTimestamp,
	) {}
}
