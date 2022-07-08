import { AuthorizationConfig } from "@authorization/interfaces/objects";
import { IConfigProvider } from "@authorization/interfaces/utils";
import { AESKey } from "@hypernetlabs/common-objects";
import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	SecurityConfigUtils,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ConfigProvider
	implements IConfigProvider, IRedisConfigProvider, ISecurityConfigProvider
{
	protected config: AuthorizationConfig;

	constructor() {
		if (process.env.AUTHORIZATION_SERVICE_KEY == null) {
			throw new Error("Invalid AUTHORIZATION_SERVICE_KEY");
		}
		if (process.env.AUTHORIZATION_ENCRYPTION_KEY == null) {
			throw new Error("Invalid AUTHORIZATION_ENCRYPTION_KEY");
		}

		this.config = new AuthorizationConfig(
			AESKey(process.env.AUTHORIZATION_ENCRYPTION_KEY),
			process.env.AUTHORIZATION_REDIS_HOST || "localhost", // redisHost
			Number(process.env.AUTHORIZATION_REDIS_PORT) || 6379, // redisPort
			new DatabaseConfig(
				process.env.AUTHORIZATION_DATABASE_TYPE || "mysql",
				process.env.AUTHORIZATION_DATABASE_USERNAME || "authorization",
				process.env.AUTHORIZATION_DATABASE_PASSWORD ||
					"authorization-password",
				process.env.AUTHORIZATION_DATABASE_HOST || "shared-sql",
				Number(process.env.AUTHORIZATION_DATABASE_PORT) || 3306,
				process.env.AUTHORIZATION_DATABASE_SCHEMA || "authorization",
			),
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.AUTHORIZATION_SERVICE_KEY,
				"AUTHORIZATION_SERVICE_KEY",
			),
			EService.Authorization,
			SecurityConfigUtils.getServiceAccountAddresses(),
		);
	}

	public getConfig(): ResultAsync<AuthorizationConfig, never> {
		return okAsync(this.config);
	}
}
