import { AESKey, EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { EService } from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class SecurityConfigUtils {
	static getServiceAccountAddresses(): Map<EService, EthereumAccountAddress> {
		return new Map([
			[
				EService.Authentication,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_AUTHENTICATION_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_AUTHENTICATION_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Authorization,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_AUTHORIZATION_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_AUTHORIZATION_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Avalanche,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_AVALANCHE_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_AVALANCHE_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Collection,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_COLLECTION_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_COLLECTION_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.CorporateGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env
						.SECURITY_CORPORATE_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_CORPORATE_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Corporate,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_CORPORATE_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_CORPORATE_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.CustomerGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env
						.SECURITY_CUSTOMER_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_CUSTOMER_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Fuji,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_FUJI_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_FUJI_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Identity,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_IDENTITY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_IDENTITY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.InternalGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env
						.SECURITY_INTERNAL_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_INTERNAL_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.IPFS,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_IPFS_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_IPFS_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.JumioGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_JUMIO_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_JUMIO_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Mumbai,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_MUMBAI_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_MUMBAI_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Notification,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_NOTIFICATION_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_NOTIFICATION_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Polygon,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_POLYGON_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_POLYGON_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.PublicGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_PUBLIC_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_PUBLIC_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.ReferralLink,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_REFERRAL_LINK_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_REFERRAL_LINK_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Rinkeby,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_RINKEBY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_RINKEBY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.TestChain,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_TEST_CHAIN_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_TEST_CHAIN_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.TestChain2,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_TEST_CHAIN_2_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_TEST_CHAIN_2_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.Token,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_TOKEN_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_TOKEN_SERVICE_ACCOUNT_ADDRESS",
				),
			],
			[
				EService.UserGateway,
				SecurityConfigUtils.getSafeAccountAddressFromEnv(
					process.env.SECURITY_USER_GATEWAY_SERVICE_ACCOUNT_ADDRESS,
					"SECURITY_USER_GATEWAY_SERVICE_ACCOUNT_ADDRESS",
				),
			],
		]);
	}

	static getSafeAccountAddressFromEnv(
		val: string | undefined,
		label: string,
	): EthereumAccountAddress {
		if (val == null) {
			throw new Error(`Invalid configuration value: ${label}`);
		}
		return EthereumAccountAddress(val);
	}

	static getSafeEthereumPrivateKeyFromEnv(
		val: string | undefined,
		label: string,
	): EthereumPrivateKey {
		if (val == null) {
			throw new Error(
				`Invalid ethereum private key config value: ${label}`,
			);
		}

		return EthereumPrivateKey(val.trim());
	}

	static getSafeAESKeyFromEnv(
		val: string | undefined,
		label: string,
	): AESKey {
		if (val == null || val.length != 44) {
			throw new Error(`Invalid AES key config value: ${label}`);
		}

		return AESKey(val.trim());
	}

	static getPreviousEncryptionKeys(
		val: string | undefined,
		label: string,
	): Map<number, AESKey> {
		const message = `Invalid previous encryption keys config value: ${label}. The proper format is version:key|version:key`;
		if (val == null) {
			throw new Error(message);
		}

		const keys = val.split("|");
		return new Map(
			keys.map((key) => {
				if (key == null || key.length == 0) {
					throw new Error(message);
				}
				const [version, encryptionKey] = key.split(":");

				const versionNum = parseInt(version);
				if (isNaN(versionNum)) {
					throw new Error(message);
				}

				return [versionNum, AESKey(encryptionKey)];
			}),
		);
	}
}
