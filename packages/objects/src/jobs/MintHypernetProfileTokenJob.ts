import { ChainId, UUID } from "@hypernetlabs/objects";
import { UserContext } from "@objects/UserContext";
import { ChainBaseJob } from "@objects/jobs/base/ChainBaseJob";

export class MintHypernetProfileTokenJob extends ChainBaseJob {
	public constructor(
		userContext: UserContext,
		public chainId: ChainId,
		public chainTokenId: UUID,
	) {
		super(userContext, chainId);
	}

	public getQueueName(): string {
		return `Chain-${this.chainId}-HypernetProfileTokenMint`;
	}
}
