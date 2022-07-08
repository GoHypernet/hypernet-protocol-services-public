import { IRedisConfigProvider } from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	SecurityConfigUtils,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { BucketConfig, IPFSConfig } from "@ipfs/interfaces/objects";
import { IConfigProvider } from "@ipfs/interfaces/utils";

@injectable()
export class ConfigProvider
	implements IConfigProvider, IRedisConfigProvider, ISecurityConfigProvider
{
	protected ipfsConfig: IPFSConfig;

	constructor() {
		this.ipfsConfig = new IPFSConfig(
			new DatabaseConfig(
				process.env.IPFS_DATABASE_TYPE || "mysql",
				process.env.IPFS_DATABASE_USERNAME || "ipfs",
				process.env.IPFS_DATABASE_PASSWORD || "ipfs-password",
				process.env.IPFS_DATABASE_HOST || "shared-sql",
				Number(process.env.IPFS_DATABASE_PORT) || 3306,
				process.env.IPFS_DATABASE_SCHEMA || "ipfs",
			),
			process.env.IPFS_GATEWAY_URL ||
				"https://ipfs.gateway.hypernet.foundation",
			process.env.IPFS_API_URL || "https://ipfs.hypernet.foundation",
			new BucketConfig(
				process.env.IPFS_GOOGLE_PROJECT_ID || "profound-ripsaw-232522",
				process.env.IPFS_GOOGLE_CREDENTIAL_FILE_PATH ||
					"/app/credentials/ipfs-service-credential.json",
				process.env.IPFS_GOOGLE_PRIVATE_BUCKET_NAME ||
					"file-upload-local-private",
				process.env.IPFS_GOOGLE_PUBLIC_BUCKET_NAME ||
					"file-upload-local-public",
				[
					process.env.IPFS_GOOGLE_PUBLIC_BUCKET_SUBSCRIPTION_ID ||
						"file-upload-local-public-sub",
					process.env.IPFS_GOOGLE_PRIVATE_BUCKET_SUBSCRIPTION_ID ||
						"file-upload-local-private-sub",
				],
			),
			process.env.IPFS_REDIS_HOST || "localhost", // redisHost
			Number(process.env.IPFS_REDIS_PORT) || 6379, // redisPort
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.IPFS_SERVICE_KEY,
				"IPFS_SERVICE_KEY",
			),
			EService.IPFS,
			SecurityConfigUtils.getServiceAccountAddresses(),
		);
	}

	public getConfig(): ResultAsync<IPFSConfig, never> {
		return okAsync(this.ipfsConfig);
	}
}
