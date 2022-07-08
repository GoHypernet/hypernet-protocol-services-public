import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { IRedisConfig } from "@hypernetlabs/common-redis-provider";
import { ISecurityConfig } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class AuthenticationConfig implements IRedisConfig, ISecurityConfig {
	constructor(
		public tokenSigningKey: string,
		public walletTokenAudience: string,
		public serviceTokenAudience: string,
		public corporateTokenAudience: string,
		public tokenIssuer: string,
		public nonceSize: number,
		public nonceLifetime: number, // In seconds
		public redisHost: string,
		public redisPort: number,
		public auth0Issuer: string,
		public auth0Audience: string,
		public auth0ClientId: string,
		public jwksUrl: string,
		public serviceKey: EthereumPrivateKey,
		public serviceType: EService,
		public serviceAccountAddresses: Map<EService, EthereumAccountAddress>,
	) {}
}
