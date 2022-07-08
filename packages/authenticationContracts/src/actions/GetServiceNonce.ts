import { EService } from "@hypernetlabs/hypernet.id-objects";

export class GetServiceNonce {
	public constructor(public service: EService) {}

	static actionName = "getServiceNonce";
	static fullActionName = `${EService.Authentication}.${GetServiceNonce.actionName}`;
}
