import { UUID } from "@hypernetlabs/objects";

import { IPFSContentIdentifier } from "@objects/IPFSContentIdentifier";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";
import { UrlString } from "@authenticationContracts/UrlString";

export class FileCreatedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public fileId: UUID,
		public filename: string,
		public uploadLocationId: UUID,
		public cid: IPFSContentIdentifier | null,
		public locationIdentifier: string,
		public bucketFileUrl: UrlString,
	) {
		super(userContext);
	}

	static eventName = "OnFileCreatedEvent";
}
