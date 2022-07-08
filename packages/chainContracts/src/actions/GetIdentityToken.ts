import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class GetIdentityToken {
	public constructor(public accountAddress: EthereumAccountAddress) {}

	static actionName = "getIdentityToken";
}
