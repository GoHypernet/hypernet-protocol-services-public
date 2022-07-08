import { UnixTimestamp } from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export class LegalNameDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		public givenName: string | null,
		public familyName: string | null,
		public middleName: string | null,
		public nickName: string | null,
		public wholeName: string | null,
		public collectedTimestamp: UnixTimestamp,
	) {
		super(versionId, identityId, timestamp);
	}
}
