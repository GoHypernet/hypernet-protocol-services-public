import { IdentityId, UsernameString } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class MintProfileToken {
	public constructor(
		public identityId: IdentityId,
		public username: UsernameString,
		public accountAddress: EthereumAccountAddress,
	) {}

	static actionName = "mintProfileToken";
}
