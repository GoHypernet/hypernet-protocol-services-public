import { UUID } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class FileUploadedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public filename: string,
		public uploadLocationId: UUID,
		public locationIdentifier: string,
		public filePath: string,
	) {
		super(userContext);
	}

	static eventName = "OnFileUploaded";
}
