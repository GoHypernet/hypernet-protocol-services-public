import { EService, ReferralLinkId } from "@hypernetlabs/hypernet.id-objects";

export class GetMessage {
	public constructor(public referralLinkId?: ReferralLinkId) {}

	static actionName = "getMessage";
	static fullActionName = `${EService.Authentication}.${GetMessage.actionName}`;
}
