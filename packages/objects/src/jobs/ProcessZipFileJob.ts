import { UUID } from "@hypernetlabs/objects";
import { UserContext } from "@objects/UserContext";
import { BaseJob } from "@objects/jobs/base/BaseJob";

export class ProcessZipFileJob extends BaseJob {
	public constructor(
		userContext: UserContext,
		public fileId: UUID,
		public filename: string,
		public uploadLocationId: UUID,
	) {
		super(userContext);
	}

	public getQueueName(): string {
		return "IPFS-ZipFileProcess";
	}
}
