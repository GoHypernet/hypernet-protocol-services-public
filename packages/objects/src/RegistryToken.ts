import {
	ChainId,
	EthereumAccountAddress,
	EthereumContractAddress,
	RegistryTokenId,
} from "@hypernetlabs/objects";

export class RegistryToken {
	public constructor(
		public chainId: ChainId,
		public registryAddress: EthereumContractAddress,
		public tokenId: RegistryTokenId,
		public accountAddress: EthereumAccountAddress,
		public label: string | null,
		public tokenUri: string | null,
	) {}
}
