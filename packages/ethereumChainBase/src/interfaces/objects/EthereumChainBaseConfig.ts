import { AESKey, EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { IRedisConfig } from "@hypernetlabs/common-redis-provider";
import { ISecurityConfig } from "@hypernetlabs/hypernet.id-authentication-contracts";
import { DatabaseConfig, EService } from "@hypernetlabs/hypernet.id-objects";
import {
	ChainId,
	EthereumAccountAddress,
	EthereumContractAddress,
} from "@hypernetlabs/objects";

export class EthereumChainBaseConfig implements IRedisConfig, ISecurityConfig {
	constructor(
		public privateKey: string,
		public blockchainRPCProviderUrl: string,
		public identityRegistryAddress: EthereumContractAddress,
		public profileRegistryAddress: EthereumContractAddress,
		public registryFactoryAddress: EthereumContractAddress,
		public hypertokenAddress: EthereumContractAddress | null,
		public chainId: ChainId,
		public specialGasHandling: boolean,
		public redisHost: string,
		public redisPort: number,
		public viewingLinkBaseUrl: string,
		public databaseConfig: DatabaseConfig,
		public serviceKey: EthereumPrivateKey,
		public serviceType: EService,
		public serviceAccountAddresses: Map<EService, EthereumAccountAddress>,
		public encryptionKey: AESKey,
		public encryptionKeyVersion: number,
		public previousEncryptionKeys: Map<number, AESKey>,
		public chainEnabled: boolean,
	) {}

	public toString(): string {
		return `EthereumChainBaseConfig: {
		blockchainRPCProviderUrl: "${this.blockchainRPCProviderUrl}",
		chainId: "${this.chainId}",
		privateKey: "${this.privateKey.slice(0, 4)}*******",}`;
	}
}
