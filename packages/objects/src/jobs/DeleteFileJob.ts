import { UUID } from "@hypernetlabs/objects";
import { UserContext } from "@objects/UserContext";
import { BaseJob } from "@objects/jobs/base/BaseJob";

export class DeleteFileJob extends BaseJob {
	public constructor(
		userContext: UserContext,
		public filename: string,
		public uploadLocationId: UUID,
	) {
		super(userContext);
	}

	public getQueueName(): string {
		return "IPFS-FileDelete";
	}
}
