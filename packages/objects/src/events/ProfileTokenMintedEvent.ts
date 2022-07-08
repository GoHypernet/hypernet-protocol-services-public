import { MintedProfileToken } from "@hypernetlabs/hypernet-id-objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class ProfileTokenMintedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public mintedToken: MintedProfileToken,
	) {
		super(userContext);
	}

	static eventName = "OnProfileTokenMinted";
}
