import { UnixTimestamp } from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { PIIField } from "@objects/documents/PIIField";
import { IdentityId } from "@objects/IdentityId";
import { PhysicalAddress } from "@objects/PhysicalAddress";
import { VersionId } from "@objects/VersionId";

// Based on answers at https://stackoverflow.com/questions/929684/is-there-common-street-addresses-database-design-for-all-addresses-of-the-world
export class PhysicalAddressesDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		public addresses: PIIField<PhysicalAddress>[],
	) {
		super(versionId, identityId, timestamp);
	}
}
