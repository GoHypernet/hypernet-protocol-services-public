import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class OnboardingCompletedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
	) {
		super(userContext);
	}

	static eventName = "OnOnboardingCompleted";
}
