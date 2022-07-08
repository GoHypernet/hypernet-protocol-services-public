import {
	EService,
	Nonce,
	ReferralLinkId,
} from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress, Signature } from "@hypernetlabs/objects";

export class SubmitSignedNonce {
	public constructor(
		public accountAddress: EthereumAccountAddress,
		public signature: Signature,
		public referralLinkId?: ReferralLinkId,
		public nftNonce?: Nonce,
	) {}

	static actionName = "submitSignedNonce";
	static fullActionName = `${EService.Authentication}.${SubmitSignedNonce.actionName}`;
}
