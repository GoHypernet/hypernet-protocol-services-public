import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { ReferralLinkId } from "@objects/ReferralLinkId";
import { UserContext } from "@objects/UserContext";

export class IdentityVerificationSubmittedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public referralLinkId: ReferralLinkId | null,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityVerificationSubmitted";
}
