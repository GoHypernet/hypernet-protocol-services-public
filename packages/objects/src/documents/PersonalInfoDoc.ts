import { UnixTimestamp } from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { PIIField } from "@objects/documents/PIIField";
import { EncryptedString } from "@objects/EncryptedString";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export class PersonalInfoDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		public birthday: PIIField<UnixTimestamp>,
		public gender: PIIField<EncryptedString>,
		public fatherName: PIIField<EncryptedString>,
		public motherName: PIIField<EncryptedString>,
	) {
		super(versionId, identityId, timestamp);
	}
}
