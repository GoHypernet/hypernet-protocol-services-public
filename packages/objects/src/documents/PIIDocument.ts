import { UnixTimestamp } from "@hypernetlabs/objects";

import { BaseDocument } from "@objects/documents/BaseDocument";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export abstract class PIIDocument extends BaseDocument {
	public constructor(
		public versionId: VersionId,
		public identityId: IdentityId,
		public timestamp: UnixTimestamp,
	) {
		super(versionId, timestamp);
	}
}
