import { CorporateId } from "@objects/CorporateId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class MemberRemovedFromCorporateEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public corporateId: CorporateId,
		public identityId: IdentityId,
	) {
		super(userContext);
	}

	static eventName = "OnMemberRemovedFromCorporate";
}
