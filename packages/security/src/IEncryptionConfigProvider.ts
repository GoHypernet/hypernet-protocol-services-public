import { ResultAsync } from "neverthrow";

import { IEncryptionConfig } from "@security/IEncryptionConfig";

export interface IEncryptionConfigProvider {
	getConfig(): ResultAsync<IEncryptionConfig, never>;
}

export const IEncryptionConfigProviderType = Symbol.for(
	"IEncryptionConfigProvider",
);
