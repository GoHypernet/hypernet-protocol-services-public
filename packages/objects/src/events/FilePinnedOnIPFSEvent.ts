import { UUID } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IPFSContentIdentifier } from "@objects/IPFSContentIdentifier";
import { UserContext } from "@objects/UserContext";

export class FilePinnedOnIPFSEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public cid: IPFSContentIdentifier,
		public uploadLocationId: UUID,
		public fileId: UUID,
		public filename: string,
	) {
		super(userContext);
	}

	static eventName = "OnFilePinnedOnIPFSEvent";
}
