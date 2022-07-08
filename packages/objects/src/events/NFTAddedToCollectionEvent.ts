import { UUID } from "@hypernetlabs/objects";

import { IdentityId } from "@authenticationContracts/IdentityId";
import { CollectionId } from "@objects/CollectionId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { Nonce } from "@objects/Nonce";
import { UserContext } from "@objects/UserContext";

export class NFTAddedToCollectionEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public collectionId: CollectionId,
		public nftId: UUID,
		public identityId: IdentityId | null,
		public nftNonce: Nonce,
	) {
		super(userContext);
	}

	static eventName = "OnNFTAddedToCollection";
}
