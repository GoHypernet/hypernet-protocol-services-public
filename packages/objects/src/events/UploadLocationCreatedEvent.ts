import { UUID } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";
import { EUploadLocationAccess } from "@objects/EUploadLocationAccess";
import { EUploadLocationFilePinning } from "@objects/EUploadLocationFilePinning";

export class UploadLocationCreatedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public id: UUID,
		public locationIdentifier: string,
		public googleBucketName: string,
		public filePinning: EUploadLocationFilePinning,
		public access: EUploadLocationAccess,
	) {
		super(userContext);
	}

	static eventName = "OnUploadLocationCreated";
}
