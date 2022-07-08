import { EService } from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";

export class ResolveToken {
	public constructor(public token: JsonWebToken) {}

	static actionName = "resolveToken";
	static fullActionName = `${EService.Authentication}.${ResolveToken.actionName}`;
}
