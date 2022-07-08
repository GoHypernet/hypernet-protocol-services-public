import { Signature } from "@hypernetlabs/objects";

import { UserContext } from "@objects/UserContext";

export class BaseEvent {
	public constructor(public userContext: UserContext) {}
	public signature: Signature | undefined;
}
