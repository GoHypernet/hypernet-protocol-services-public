import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class GetProfileToken {
	public constructor(public accountAddress: EthereumAccountAddress) {}

	static actionName = "getProfileToken";
}
