import { AESEncryptedString } from "@hypernetlabs/common-objects";
import { EncryptionKeyUnavailableError } from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

export interface IEncryptionUtils {
	rolloverEncryptedData(
		original: AESEncryptedString,
		originalKeyVersion: number,
	): ResultAsync<EncryptionResult, EncryptionKeyUnavailableError>;

	encryptSecret(secret: string): ResultAsync<EncryptionResult, never>;
	decryptSecret(
		secret: AESEncryptedString,
		keyVersion: number,
	): ResultAsync<string, EncryptionKeyUnavailableError>;
}

export class EncryptionResult {
	public constructor(
		public encryptedString: AESEncryptedString,
		public encyrptionKeyVersion: number,
	) {}
}

export const IEncryptionUtilsType = Symbol.for("IEncryptionUtils");
