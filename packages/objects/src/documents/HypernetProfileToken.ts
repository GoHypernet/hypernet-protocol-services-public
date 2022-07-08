import {
	ChainId,
	EthereumAccountAddress,
	RegistryTokenId,
} from "@hypernetlabs/objects";

export class HypernetProfileToken {
	public constructor(
		public ownerAddress: EthereumAccountAddress,
		public username: string,
		public chainId: ChainId,
		public content: string, // TODO: This is JSON data, we should make seperate parsed fields for this.
		public tokenId: RegistryTokenId,
	) {}
}
