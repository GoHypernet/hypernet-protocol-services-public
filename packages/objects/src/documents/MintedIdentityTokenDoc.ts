import { MintedIdentityToken } from "@hypernetlabs/hypernet-id-objects";
import { UnixTimestamp } from "@hypernetlabs/objects";

import { BaseDocument } from "@objects/documents/BaseDocument";
import { IdentityId } from "@objects/IdentityId";
import { VersionId } from "@objects/VersionId";

export class MintedIdentityTokenDoc extends BaseDocument {
	constructor(
		versionId: VersionId,
		timestamp: UnixTimestamp,
		public identityId: IdentityId,
		public mintedToken: MintedIdentityToken,
	) {
		super(versionId, timestamp);
	}
}
