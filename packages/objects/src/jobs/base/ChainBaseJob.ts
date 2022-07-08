import { UserContext } from "@objects/UserContext";
import { ChainId } from "@hypernetlabs/objects";
import { BaseJob } from "@objects/jobs/base/BaseJob";

export abstract class ChainBaseJob extends BaseJob {
	public constructor(userContext: UserContext, public chainId: ChainId) {
		super(userContext);
	}

	public abstract getQueueName(): string;
}
