import { UUID } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class ZipFileUploadedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public filename: string,
		public uploadLocationId: UUID,
	) {
		super(userContext);
	}

	static eventName = "OnZipFileUploaded";
}
