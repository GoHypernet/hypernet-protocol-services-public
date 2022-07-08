import { ResultAsync } from "neverthrow";

import { AuthenticationConfig } from "@authentication/interfaces/objects";

export interface IConfigProvider {
	getConfig(): ResultAsync<AuthenticationConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
