import { UnixTimestamp } from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export class OfficialDocumentsDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		public passport: PassportInfo | null,
	) {
		super(versionId, identityId, timestamp);
	}
}

export class PassportInfo {}
