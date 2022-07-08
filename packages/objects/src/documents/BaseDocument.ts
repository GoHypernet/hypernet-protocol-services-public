import { UnixTimestamp } from "@hypernetlabs/objects";

import { VersionId } from "@objects/VersionId";

export abstract class BaseDocument {
	public constructor(
		public versionId: VersionId,
		public timestamp: UnixTimestamp,
	) {}
}
