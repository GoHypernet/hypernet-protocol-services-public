import { IPFSContentIdentifier } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { UnixTimestamp } from "@hypernetlabs/objects";

import { EFileStatus } from "@ipfsContracts/objects";

export class NewFile {
	public constructor(
		public filename: string,
		public uploadLocationId: UUID,
		public fileStatus: EFileStatus,
		public cid: IPFSContentIdentifier | null,
	) {}
}

export class File extends NewFile {
	public constructor(
		public id: UUID,
		public filename: string,
		public uploadLocationId: UUID,
		public fileStatus: EFileStatus,
		public cid: IPFSContentIdentifier | null,
		public creationTimestamp: UnixTimestamp,
		public updatedTimestamp: UnixTimestamp,
	) {
		super(filename, uploadLocationId, fileStatus, cid);
	}
}
