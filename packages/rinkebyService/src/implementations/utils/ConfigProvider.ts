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
		const chainInfo = getChainInfoByChainId(ChainId(4));
		this.logger.debug("Rinkeby ConfigProvider");

		this.config = new EthereumChainBaseConfig(
			process.env.RINKEBY_PRIVATE_KEY != null
				? process.env.RINKEBY_PRIVATE_KEY.trim()
				: "Rinkeby: Invalid Private Key",
			process.env.RINKEBY_RPC_PROVIDER_URL ||
				"https://rinkeby.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
			chainInfo.identityRegistryAddress,
			chainInfo.profileRegistryAddress,
			chainInfo.registryFactoryAddress,
			chainInfo.hypertokenAddress,
			chainInfo.chainId,
			chainInfo.specialGasHandling,
			process.env.RINKEBY_REDIS_HOST || "localhost", // redisHost
			Number(process.env.RINKEBY_REDIS_PORT) || 6379, // redisPort
			process.env.RINKEBY_VIEWING_LINK_BASE_URL ||
				"https://rinkeby.etherscan.io", // viewingLinkBaseUrl
			new DatabaseConfig(
				process.env.RINKEBY_DATABASE_TYPE || "mysql",
				process.env.RINKEBY_DATABASE_USERNAME || "rinkeby",
				process.env.RINKEBY_DATABASE_PASSWORD || "rinkeby-password",
				process.env.RINKEBY_DATABASE_HOST || "localhost",
				Number(process.env.RINKEBY_DATABASE_PORT) || 3308,
				process.env.RINKEBY_DATABASE_SCHEMA || "rinkeby",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.RINKEBY_SERVICE_KEY,
				"RINKEBY_SERVICE_KEY",
			),
			EService.Rinkeby,
			SecurityConfigUtils.getServiceAccountAddresses(),
			SecurityConfigUtils.getSafeAESKeyFromEnv(
				process.env.RINKEBY_ENCRYPTION_KEY,
				"RINKEBY_ENCRYPTION_KEY",
			),
			Number(process.env.RINKEBY_ENCRYPTION_KEY_VERSION),
			SecurityConfigUtils.getPreviousEncryptionKeys(
				process.env.RINKEBY_PREVIOUS_ENCRYPTION_KEYS,
				"RINKEBY_PREVIOUS_ENCRYPTION_KEYS",
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
