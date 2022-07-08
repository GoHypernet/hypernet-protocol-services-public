import { ChainId } from "@hypernetlabs/objects";

export class GetChainStatus {
	public constructor(public chainId: ChainId) {}

	static actionName = "GetChainStatus";
}
