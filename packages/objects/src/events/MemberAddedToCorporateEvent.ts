import { CorporateId } from "@objects/CorporateId";
import { ECorporateRole } from "@objects/enum/ECorporateRole";
import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class MemberAddedToCorporateEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public corporateId: CorporateId,
		public identityId: IdentityId,
		public role: ECorporateRole,
	) {
		super(userContext);
	}

	static eventName = "OnMemberAddedToCorporate";
}
