import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	SecurityConfigUtils,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
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
export class ConfigProvider
	implements IConfigProvider, IRedisConfigProvider, ISecurityConfigProvider
{
	protected config: EthereumChainBaseConfig;

	constructor(@inject(LoggerType) protected logger: LoggerInstance) {
		const chainInfo = getChainInfoByChainId(ChainId(137));
		this.logger.debug("Polygon ConfigProvider");

		this.config = new EthereumChainBaseConfig(
			process.env.POLYGON_PRIVATE_KEY != null
				? process.env.POLYGON_PRIVATE_KEY.trim()
				: "Polygon: Invalid Private Key",
			process.env.POLYGON_RPC_PROVIDER_URL ||
				"https://polygon.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
			chainInfo.identityRegistryAddress,
			chainInfo.profileRegistryAddress,
			chainInfo.registryFactoryAddress,
			chainInfo.hypertokenAddress,
			chainInfo.chainId,
			chainInfo.specialGasHandling,
			process.env.POLYGON_REDIS_HOST || "localhost", // redisHost
			Number(process.env.POLYGON_REDIS_PORT) || 6379, // redisPort
			process.env.POLYGON_VIEWING_LINK_BASE_URL ||
				"https://rinkeby.etherscan.io", // viewingLinkBaseUrl
			new DatabaseConfig(
				process.env.POLYGON_DATABASE_TYPE || "mysql",
				process.env.POLYGON_DATABASE_USERNAME || "polygon",
				process.env.POLYGON_DATABASE_PASSWORD || "polygon-password",
				process.env.POLYGON_DATABASE_HOST || "localhost",
				Number(process.env.POLYGON_DATABASE_PORT) || 3308,
				process.env.POLYGON_DATABASE_SCHEMA || "polygon",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.POLYGON_SERVICE_KEY,
				"POLYGON_SERVICE_KEY",
			),
			EService.Polygon,
			SecurityConfigUtils.getServiceAccountAddresses(),
			SecurityConfigUtils.getSafeAESKeyFromEnv(
				process.env.POLYGON_ENCRYPTION_KEY,
				"POLYGON_ENCRYPTION_KEY",
			),
			Number(process.env.POLYGON_ENCRYPTION_KEY_VERSION),
			SecurityConfigUtils.getPreviousEncryptionKeys(
				process.env.POLYGON_PREVIOUS_ENCRYPTION_KEYS,
				"POLYGON_PREVIOUS_ENCRYPTION_KEYS",
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
