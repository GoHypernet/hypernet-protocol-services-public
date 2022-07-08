import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";
import { UsernameString } from "@objects/UsernameString";

export class UsernameAddedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public username: UsernameString,
	) {
		super(userContext);
	}

	static eventName = "OnUsernameAdded";
}
