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
		const chainInfo = getChainInfoByChainId(ChainId(80001));
		this.logger.debug("Mumbai ConfigProvider");

		this.config = new EthereumChainBaseConfig(
			process.env.MUMBAI_PRIVATE_KEY != null
				? process.env.MUMBAI_PRIVATE_KEY.trim()
				: "Mumbai: Invalid Private Key",
			process.env.MUMBAI_RPC_PROVIDER_URL ||
				"https://mumbai.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
			chainInfo.identityRegistryAddress,
			chainInfo.profileRegistryAddress,
			chainInfo.registryFactoryAddress,
			chainInfo.hypertokenAddress,
			chainInfo.chainId,
			chainInfo.specialGasHandling,
			process.env.MUMBAI_REDIS_HOST || "localhost", // redisHost
			Number(process.env.MUMBAI_REDIS_PORT) || 6379, // redisPort
			process.env.MUMBAI_VIEWING_LINK_BASE_URL ||
				"https://rinkeby.etherscan.io", // viewingLinkBaseUrl
			new DatabaseConfig(
				process.env.MUMBAI_DATABASE_TYPE || "mysql",
				process.env.MUMBAI_DATABASE_USERNAME || "mumbai",
				process.env.MUMBAI_DATABASE_PASSWORD || "mumbai-password",
				process.env.MUMBAI_DATABASE_HOST || "localhost",
				Number(process.env.MUMBAI_DATABASE_PORT) || 3308,
				process.env.MUMBAI_DATABASE_SCHEMA || "mumbai",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.MUMBAI_SERVICE_KEY,
				"MUMBAI_SERVICE_KEY",
			),
			EService.Mumbai,
			SecurityConfigUtils.getServiceAccountAddresses(),
			SecurityConfigUtils.getSafeAESKeyFromEnv(
				process.env.MUMBAI_ENCRYPTION_KEY,
				"MUMBAI_ENCRYPTION_KEY",
			),
			Number(process.env.MUMBAI_ENCRYPTION_KEY_VERSION),
			SecurityConfigUtils.getPreviousEncryptionKeys(
				process.env.MUMBAI_PREVIOUS_ENCRYPTION_KEYS,
				"MUMBAI_PREVIOUS_ENCRYPTION_KEYS",
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
