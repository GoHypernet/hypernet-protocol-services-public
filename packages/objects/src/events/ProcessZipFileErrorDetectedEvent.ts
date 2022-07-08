import { UUID } from "@hypernetlabs/objects";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class ProcessZipFileErrorDetectedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public zipFilename: string,
		public extractedfilename: string,
		public uploadLocationId: UUID,
	) {
		super(userContext);
	}

	static eventName = "onProcessZipFileErrorDetectedEvent";
}
