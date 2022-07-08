import { AESEncryptedString } from "@hypernetlabs/common-objects";
import { IdentityId } from "@hypernetlabs/hypernet.id-objects";
import { UnixTimestamp, UUID } from "@hypernetlabs/objects";

export class NewIdentityKey {
	public constructor(
		public identityId: IdentityId,
		public identityDecryptionKey: AESEncryptedString,
	) {}
}

export class IdentityKey {
	public constructor(
		public id: UUID,
		public identityId: IdentityId,
		public identityDecryptionKey: AESEncryptedString,
		public updatedTimestamp: UnixTimestamp,
		public createdTimestamp: UnixTimestamp,
		public deleted: boolean,
	) {}
}
