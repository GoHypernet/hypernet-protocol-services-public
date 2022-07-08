import { EService } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";

export class GetUploadLink {
	public constructor(
		public uploadLocationId: UUID,
		public filename: string,
	) {}

	static actionName = "getUploadLink";
	static fullActionName = `${EService.IPFS}.${GetUploadLink.actionName}`;
}
