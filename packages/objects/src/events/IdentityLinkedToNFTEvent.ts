import { UUID } from "@hypernetlabs/objects";

import { CollectionId } from "@objects/CollectionId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class IdentityLinkedToNFTEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public collectionId: CollectionId,
		public nftId: UUID,
		public identityId: IdentityId,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityLinkedToNFT";
}
