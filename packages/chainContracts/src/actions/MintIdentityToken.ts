import { IdentityDoc } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class MintIdentityToken {
	public constructor(
		public identity: IdentityDoc,
		public accountAddress: EthereumAccountAddress,
	) {}

	static actionName = "mintIdentityToken";
}
