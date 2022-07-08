import { EscrowWalletId } from "@hypernetlabs/hypernet.id-objects";

export class CreateRegistry {
	public constructor(
		public escrowWalletId: EscrowWalletId,
		public name: string,
		public symbol: string,
		public enumerable: boolean,
	) {}

	static actionName = "CreateRegistry";
}
