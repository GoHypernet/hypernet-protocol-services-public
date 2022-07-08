import { EthereumAccountAddress } from "@hypernetlabs/objects";

import { CollectionId } from "@objects/CollectionId";
import { BaseEvent } from "@objects/events/BaseEvent";
import { ReferralLinkId } from "@objects/ReferralLinkId";
import { UserContext } from "@objects/UserContext";
import { UsernameString } from "@objects/UsernameString";

export class CollectionCreatedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public collectionId: CollectionId,
		public firstAccountAddress: EthereumAccountAddress,
		public username: UsernameString | null,
		public referralLinkId: ReferralLinkId | null,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityCreated";
}
