import { EthereumChainBaseConfig } from "@ethereumChainBase/interfaces/objects";
import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import { ResultAsync } from "neverthrow";

export interface IConfigProvider extends IRedisConfigProvider {
	getConfig(): ResultAsync<EthereumChainBaseConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
