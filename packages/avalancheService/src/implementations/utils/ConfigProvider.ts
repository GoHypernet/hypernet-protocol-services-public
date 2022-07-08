import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import { SecurityConfigUtils } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { getChainInfoByChainId } from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	EthereumChainBaseConfig,
	IConfigProvider,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import { ChainId } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ConfigProvider implements IConfigProvider, IRedisConfigProvider {
	protected config: EthereumChainBaseConfig;

	constructor(@inject(LoggerType) protected logger: LoggerInstance) {
		const chainInfo = getChainInfoByChainId(ChainId(43114));
		this.logger.debug("Avalanche ConfigProvider");

		this.config = new EthereumChainBaseConfig(
			process.env.AVALANCHE_PRIVATE_KEY != null
				? process.env.AVALANCHE_PRIVATE_KEY.trim()
				: "Avalanche: Invalid Private Key",
			process.env.AVALANCHE_RPC_PROVIDER_URL ||
				"https://avalanche.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
			chainInfo.identityRegistryAddress,
			chainInfo.profileRegistryAddress,
			chainInfo.registryFactoryAddress,
			chainInfo.hypertokenAddress,
			chainInfo.chainId,
			chainInfo.specialGasHandling,
			process.env.AVALANCHE_REDIS_HOST || "localhost", // redisHost
			Number(process.env.AVALANCHE_REDIS_PORT) || 6379, // redisPort
			process.env.AVALANCHE_VIEWING_LINK_BASE_URL ||
				"https://rinkeby.etherscan.io", // viewingLinkBaseUrl
			new DatabaseConfig(
				process.env.AVALANCHE_DATABASE_TYPE || "mysql",
				process.env.AVALANCHE_DATABASE_USERNAME || "avalanche",
				process.env.AVALANCHE_DATABASE_PASSWORD || "avalanche-password",
				process.env.AVALANCHE_DATABASE_HOST || "localhost",
				Number(process.env.AVALANCHE_DATABASE_PORT) || 3308,
				process.env.AVALANCHE_DATABASE_SCHEMA || "avalanche",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.AVALANCHE_SERVICE_KEY,
				"AVALANCHE_SERVICE_KEY",
			),
			EService.Avalanche,
			SecurityConfigUtils.getServiceAccountAddresses(),
			SecurityConfigUtils.getSafeAESKeyFromEnv(
				process.env.AVALANCHE_ENCRYPTION_KEY,
				"AVALANCHE_ENCRYPTION_KEY",
			),
			Number(process.env.AVALANCHE_ENCRYPTION_KEY_VERSION),
			SecurityConfigUtils.getPreviousEncryptionKeys(
				process.env.AVALANCHE_PREVIOUS_ENCRYPTION_KEYS,
				"AVALANCHE_PREVIOUS_ENCRYPTION_KEYS",
			),
			(process.env.TOKEN_SUPPORTED_CHAINS || "")
				.split("|")
				.map((val) => ChainId(parseInt(val)))
				.includes(chainInfo.chainId),
		);
		this.logger.debug(this.config.toString());
	}

	public getConfig(): ResultAsync<EthereumChainBaseConfig, never> {
		return okAsync(this.config);
	}
}
