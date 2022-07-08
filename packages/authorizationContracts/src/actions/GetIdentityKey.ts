import { EService, IdentityId } from "@hypernetlabs/hypernet.id-objects";

export class GetIdentityKey {
	public constructor(public identityId: IdentityId) {}

	static actionName = "getIdentityKey";
	static fullActionName = `${EService.Authorization}.${GetIdentityKey.actionName}`;
}
