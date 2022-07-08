import { CollectionId } from "@objects/CollectionId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class CollectionRequiresUpdateEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public collectionId: CollectionId,
		public nameUpdateRequired: boolean,
	) {
		super(userContext);
	}

	static eventName = "OnCollectionRequiresUpdate";
}
