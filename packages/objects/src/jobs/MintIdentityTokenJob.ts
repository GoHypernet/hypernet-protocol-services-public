import { ChainId, UUID } from "@hypernetlabs/objects";
import { UserContext } from "@objects/UserContext";
import { IdentityDoc } from "@objects/documents/IdentityDoc";
import { ChainBaseJob } from "@objects/jobs/base/ChainBaseJob";

export class MintIdentityTokenJob extends ChainBaseJob {
	public constructor(
		userContext: UserContext,
		public chainId: ChainId,
		public chainTokenId: UUID,
		public identity: IdentityDoc,
	) {
		super(userContext, chainId);
	}

	public getQueueName(): string {
		return `Chain-${this.chainId}-IdentityTokenMint`;
	}
}
