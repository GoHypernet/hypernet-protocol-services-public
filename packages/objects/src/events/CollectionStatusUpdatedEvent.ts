import { CollectionId } from "@objects/CollectionId";
import { ECollectionStatus } from "@objects/enum";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class CollectionStatusUpdatedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public collectionId: CollectionId,
		public status: ECollectionStatus,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityCreated";
}
