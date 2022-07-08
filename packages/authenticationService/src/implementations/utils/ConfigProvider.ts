import { SecurityConfigUtils } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { EService } from "@hypernetlabs/hypernet.id-objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { AuthenticationConfig } from "@authentication/interfaces/objects";
import { IConfigProvider } from "@authentication/interfaces/utils";

@injectable()
export class ConfigProvider implements IConfigProvider {
	protected config: AuthenticationConfig;

	constructor() {
		this.config = new AuthenticationConfig(
			process.env.AUTHENTICATION_SIGNING_KEY != null
				? process.env.AUTHENTICATION_SIGNING_KEY.trim()
				: "c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c", // tokenSigningKey
			"wallet", // walletTokenAudience
			"service", // serviceTokenAudience
			"corporate", // corporateTokenAudience
			"Hypernet.ID", // tokenIssuer
			Number(process.env.AUTHENTICATION_NONCE_SIZE) || 64, // nonceSize
			Number(process.env.AUTHENTICATION_NONCE_LIFETIME) || 300, // nonceLifetime, seconds
			process.env.AUTHENTICATION_REDIS_HOST || "localhost", // redisHost
			Number(process.env.AUTHENTICATION_REDIS_PORT) || 6379, // redisPort
			process.env.AUTHENTICATION_AUTH0_ISSUER ||
				"https://auth.hypernetlabs.io", // auth0Issuer
			process.env.AUTHENTICATION_CUSTOMER_AUDIENCE ||
				"https://customer.api.hypernet.id", // auth0Audience,
			process.env.AUTHENTICATION_AUTH0_CLIENT_ID != null
				? process.env.AUTHENTICATION_AUTH0_CLIENT_ID.trim()
				: "FAyB77sQ8sfzPFeiRcgqx9yBTj9j7c3p", // auth0ClientId
			process.env.JWKS_URL ||
				"https://galileoapp.us.auth0.com/.well-known/jwks.json", // jwksUrl
			SecurityConfigUtils.getSafeEthereumPrivateKeyFromEnv(
				process.env.AUTHENTICATION_SERVICE_KEY,
				"AUTHENTICATION_SERVICE_KEY",
			),
			EService.Authentication,
			SecurityConfigUtils.getServiceAccountAddresses(),
		);
	}

	public getConfig(): ResultAsync<AuthenticationConfig, never> {
		return okAsync(this.config);
	}
}
