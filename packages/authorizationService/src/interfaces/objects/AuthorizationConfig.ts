import { AESKey, EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { IRedisConfig } from "@hypernetlabs/common-redis-provider";
import { ISecurityConfig } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class AuthorizationConfig implements IRedisConfig, ISecurityConfig {
	constructor(
		public encryptionKey: AESKey,
		public redisHost: string,
		public redisPort: number,
		public databaseConfig: DatabaseConfig,
		public serviceKey: EthereumPrivateKey,
		public serviceType: EService,
		public serviceAccountAddresses: Map<EService, EthereumAccountAddress>,
	) {}
}
