import { EService } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";

import { IPFSImportCandidate } from "@ipfsContracts/objects";

export class PinFile {
	public constructor(
		public uploadLocationId: UUID,
		public file: IPFSImportCandidate,
	) {}

	static actionName = "pinFile";
	static fullActionName = `${EService.IPFS}.${PinFile.actionName}`;
}
