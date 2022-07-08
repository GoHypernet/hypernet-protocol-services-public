import { AESKey } from "@hypernetlabs/common-objects";

export interface IEncryptionConfig {
	encryptionKey: AESKey;
	encryptionKeyVersion: number;
	previousEncryptionKeys: Map<number, AESKey>;
}
