import { AuthorizationConfig } from "@authorization/interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IConfigProvider {
	getConfig(): ResultAsync<AuthorizationConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
