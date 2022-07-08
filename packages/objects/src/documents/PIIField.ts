import { EncryptedString } from "@objects/EncryptedString";

export class PIIField<T> {
	public constructor(
		public data: T,
		public verified: boolean,
		public userSupplied: boolean,
		public source: EncryptedString,
	) {}
}
