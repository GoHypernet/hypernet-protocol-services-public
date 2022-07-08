import { EmailAddressString, UnixTimestamp } from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { PIIField } from "@objects/documents/PIIField";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export class EmailAddressDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		emailAddress: PIIField<EmailAddressString>,
	) {
		super(versionId, identityId, timestamp);
	}
}
