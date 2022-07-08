import { ETokenType, EscrowWalletId } from "@hypernetlabs/hypernet.id-objects";
import {
	ChainId,
	RegistryTokenId,
	UnixTimestamp,
	UUID,
	EthereumContractAddress,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";

export class NewChainToken {
	public constructor(
		public chainId: ChainId,
		public registryAddress: EthereumContractAddress,
		public tokenId: RegistryTokenId,
		public accountAddress: EthereumAccountAddress,
		public label: string | null,
		public tokenUri: string | null,
		public tokenType: ETokenType,
		public tokenIdentifier: UUID,
		public chainTransactionId: UUID | null,
		public escrowWalletId: EscrowWalletId,
	) {}
}

export class ChainToken extends NewChainToken {
	public constructor(
		public id: UUID,
		chainId: ChainId,
		registryAddress: EthereumContractAddress,
		tokenId: RegistryTokenId,
		accountAddress: EthereumAccountAddress,
		label: string | null,
		tokenUri: string | null,
		tokenType: ETokenType,
		tokenIdentifier: UUID,
		chainTransactionId: UUID | null,
		escrowWalletId: EscrowWalletId,
		public createdTimestamp: UnixTimestamp,
		public updatedTimestamp: UnixTimestamp,
	) {
		super(
			chainId,
			registryAddress,
			tokenId,
			accountAddress,
			label,
			tokenUri,
			tokenType,
			tokenIdentifier,
			chainTransactionId,
			escrowWalletId,
		);
	}
}
