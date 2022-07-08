import { UUID } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class NFTLinkedToAssetEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public nftId: UUID,
		public collectionAssetId: UUID,
		public fileName: string,
	) {
		super(userContext);
	}

	static eventName = "OnNFTLinkedToAsset";
}
