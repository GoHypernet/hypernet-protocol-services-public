import { EScreeningResult } from "@objects/enum/EScreeningResult";
import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class IdentityVerificationCompletedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public identityVerified: boolean,
		public screeningResult: EScreeningResult,
		public screeningUrl: string | null,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityVerificationCompleted";
}
