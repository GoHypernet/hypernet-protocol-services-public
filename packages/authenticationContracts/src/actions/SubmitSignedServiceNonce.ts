import { EService } from "@hypernetlabs/hypernet.id-objects";
import { Signature } from "@hypernetlabs/objects";

export class SubmitSignedServiceNonce {
	public constructor(public service: EService, public signature: Signature) {}

	static actionName = "submitSignedServiceNonce";
	static fullActionName = `${EService.Authentication}.${SubmitSignedServiceNonce.actionName}`;
}
