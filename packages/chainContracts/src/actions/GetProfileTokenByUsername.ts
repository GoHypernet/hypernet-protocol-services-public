import { UsernameString } from "@hypernetlabs/hypernet.id-objects";

export class GetProfileTokenByUsername {
	public constructor(public username: UsernameString) {}

	static actionName = "getProfileTokenByUsername";
}
