import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { ReferralLinkId } from "@objects/ReferralLinkId";
import { UserContext } from "@objects/UserContext";

export class ReferralLinkAccessedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public referralLinkId: ReferralLinkId,
	) {
		super(userContext);
	}

	static eventName = "OnReferralLinkAccessed";
}
