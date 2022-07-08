import { ChainId } from "@hypernetlabs/objects";
import { UserContext } from "@objects/UserContext";
import { ChainBaseJob } from "@objects/jobs/base/ChainBaseJob";
import { BlockNumber } from "@authenticationContracts/BlockNumber";

export class ProcessBlockJob extends ChainBaseJob {
	public constructor(
		userContext: UserContext,
		public chainId: ChainId,
		public blockNumber: BlockNumber,
	) {
		super(userContext, chainId);
	}

	public getQueueName(): string {
		return `Chain-${this.chainId}-ProcessBlock`;
	}
}
