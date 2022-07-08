import { MintedIdentityToken } from "@hypernetlabs/hypernet-id-objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class IdentityTokenMintedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public mintedToken: MintedIdentityToken,
		public viewingLink: string,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityTokenMinted";
}
