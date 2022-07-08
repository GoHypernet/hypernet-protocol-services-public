import { ChainId } from "@hypernetlabs/objects";

import { BaseJob } from "@objects/jobs/base";
import { UserContext } from "@objects/UserContext";

export class BatchMintJob extends BaseJob {
	public constructor(userContext: UserContext, public chainId: ChainId) {
		super(userContext);
	}

	public getQueueName(): string {
		return `Chain-${this.chainId}-BatchMint`;
	}
}
