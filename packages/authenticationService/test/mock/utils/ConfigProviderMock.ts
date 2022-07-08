import { okAsync, ResultAsync } from "neverthrow";

import { AuthConfig } from "@authentication/interfaces/objects";
import { IConfigProvider } from "@authentication/interfaces/utils";
import {
	privateKey,
	blockchainRPCProviderUrl,
	registryAddress,
} from "@mock/CommonValues";

export class ConfigProviderMock implements IConfigProvider {
	getConfig(): ResultAsync<AuthConfig, never> {
		return okAsync(
			new AuthConfig(
				privateKey,
				blockchainRPCProviderUrl,
				registryAddress,
			),
		);
	}
}
