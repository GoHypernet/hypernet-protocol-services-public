import { UUID } from "@hypernetlabs/objects";

import { ENFTStatus } from "@objects/ENFTStatus";
import { CollectionId } from "@objects/CollectionId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class NFTStatusUpdatedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public collectionId: CollectionId,
		public nftId: UUID,
		public status: ENFTStatus,
	) {
		super(userContext);
	}

	static eventName = "OnNFTStatusUpdated";
}
