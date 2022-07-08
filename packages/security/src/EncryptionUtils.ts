import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import { AESEncryptedString } from "@hypernetlabs/common-objects";
import { EncryptionKeyUnavailableError } from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import {
	IEncryptionConfigProvider,
	IEncryptionConfigProviderType,
} from "@security/IEncryptionConfigProvider";
import { IEncryptionUtils, EncryptionResult } from "@security/IEncryptionUtils";

@injectable()
export class EncryptionUtils implements IEncryptionUtils {
	public constructor(
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(IEncryptionConfigProviderType)
		protected configProvider: IEncryptionConfigProvider,
	) {}

	public rolloverEncryptedData(
		original: AESEncryptedString,
		originalKeyVersion: number,
	): ResultAsync<EncryptionResult, EncryptionKeyUnavailableError> {
		// To do the rollover, we need to unencrypt with the previous key, and re-encrypt with the current key
		return this.decryptSecret(original, originalKeyVersion).andThen(
			(newSecret) => {
				return this.encryptSecret(newSecret);
			},
		);
	}

	public encryptSecret(secret: string): ResultAsync<EncryptionResult, never> {
		return this.configProvider.getConfig().andThen((config) => {
			return this.cryptoUtils
				.encryptString(secret, config.encryptionKey)
				.map((encrypted) => {
					return new EncryptionResult(
						encrypted,
						config.encryptionKeyVersion,
					);
				});
		});
	}

	public decryptSecret(
		secret: AESEncryptedString,
		keyVersion: number,
	): ResultAsync<string, EncryptionKeyUnavailableError> {
		return this.configProvider.getConfig().andThen((config) => {
			// Find the key
			const key =
				config.encryptionKeyVersion == keyVersion
					? config.encryptionKey
					: config.previousEncryptionKeys.get(keyVersion);

			if (key == null) {
				return errAsync(
					new EncryptionKeyUnavailableError(
						`No encryption key with version ${keyVersion} is configured, cannot decrypt data!`,
					),
				);
			}

			// Decrypt the data
			return this.cryptoUtils.decryptAESEncryptedString(secret, key);
		});
	}
}
