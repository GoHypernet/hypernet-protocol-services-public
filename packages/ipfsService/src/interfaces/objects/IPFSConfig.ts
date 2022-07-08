import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { IRedisConfig } from "@hypernetlabs/common-redis-provider";
import { ISecurityConfig } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { BucketConfig } from "@ipfs/interfaces/objects";

export class IPFSConfig implements IRedisConfig, ISecurityConfig {
	constructor(
		public databaseConfig: DatabaseConfig,
		public ipfsGatewayUrl: string,
		public ipfsApiUrl: string,
		public googleBucketConfig: BucketConfig,
		public redisHost: string,
		public redisPort: number,
		public serviceKey: EthereumPrivateKey,
		public serviceType: EService,
		public serviceAccountAddresses: Map<EService, EthereumAccountAddress>,
	) {}
}
