import { EService } from "@hypernetlabs/hypernet.id-objects";

export class Logout {
	public constructor() {}

	static actionName = "logout";
	static fullActionName = `${EService.Authentication}.${Logout.actionName}`;
}
