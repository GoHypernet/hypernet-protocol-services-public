import { ResultAsync } from "neverthrow";

import { ISecurityConfig } from "@authenticationContracts/ISecurityConfig";

export interface ISecurityConfigProvider {
	getConfig(): ResultAsync<ISecurityConfig, never>;
}

export const ISecurityConfigProviderType = Symbol.for(
	"ISecurityConfigProvider",
);
