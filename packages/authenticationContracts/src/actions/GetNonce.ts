import { EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class GetNonce {
	public constructor(public accountAddress: EthereumAccountAddress) {}

	static actionName = "getNonce";
	static fullActionName = `${EService.Authentication}.${GetNonce.actionName}`;
}
