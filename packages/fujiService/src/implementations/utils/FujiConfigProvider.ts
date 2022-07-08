import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	SecurityConfigUtils,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { getChainInfoByChainId } from "@hypernetlabs/hypernet.id-chain-contracts";
import { DatabaseConfig } from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumChainBaseConfig,
	IConfigProvider,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import { EService } from "@hypernetlabs/hypernet.id-objects";
import { ChainId } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class FujiConfigProvider
	implements IConfigProvider, IRedisConfigProvider, ISecurityConfigProvider
{
	protected config: EthereumChainBaseConfig;

	constructor(@inject(LoggerType) protected logger: LoggerInstance) {
		const chainInfo = getChainInfoByChainId(ChainId(43113));
		this.logger.debug("Fuji ConfigProvider");

		this.config = new EthereumChainBaseConfig(
			process.env.FUJI_PRIVATE_KEY != null
				? process.env.FUJI_PRIVATE_KEY.trim()
				: "Fuji: Invalid Private Key",
			process.env.FUJI_RPC_PROVIDER_URL ||
				"https://fuji.infura.io/v3/d9f9f416d1e94778a11cabc1ddc5e931",
			chainInfo.identityRegistryAddress,
			chainInfo.profileRegistryAddress,
			chainInfo.registryFactoryAddress,
			chainInfo.hypertokenAddress,
			chainInfo.chainId,
			chainInfo.specialGasHandling,
			process.env.FUJI_REDIS_HOST || "localhost", // redisHost
			Number(process.env.FUJI_REDIS_PORT) || 6379, // redisPort
			process.env.FUJI_VIEWING_LINK_BASE_URL ||
				"https://rinkeby.etherscan.io", // viewingLinkBaseUrl
			new DatabaseConfig(
				process.env.FUJI_DATABASE_TYPE || "mysql",
				process.env.FUJI_DATABASE_USERNAME || "fuji",
				process.env.FUJI_DATABASE_PASSWORD || "fuji-password",
				process.env.FUJI_DATABASE_HOST || "localhost",
				Number(process.env.FUJI_DATABASE_PORT) || 3308,
				process.env.FUJI_DATABASE_SCHEMA || "fuji",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.FUJI_SERVICE_KEY,
				"FUJI_SERVICE_KEY",
			),
			EService.Fuji,
			SecurityConfigUtils.getServiceAccountAddresses(),
			SecurityConfigUtils.getSafeAESKeyFromEnv(
				process.env.FUJI_ENCRYPTION_KEY,
				"FUJI_ENCRYPTION_KEY",
			),
			Number(process.env.FUJI_ENCRYPTION_KEY_VERSION),
			SecurityConfigUtils.getPreviousEncryptionKeys(
				process.env.FUJI_PREVIOUS_ENCRYPTION_KEYS,
				"FUJI_PREVIOUS_ENCRYPTION_KEYS",
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
