import { ResultAsync } from "neverthrow";
import { IPFSConfig } from "@ipfs/interfaces/objects";

export interface IConfigProvider {
	getConfig(): ResultAsync<IPFSConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
