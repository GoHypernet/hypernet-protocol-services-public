import { EscrowWalletId } from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumAccountAddress,
	EthereumContractAddress,
	UUID,
} from "@hypernetlabs/objects";

export class MintRegistryToken {
	public constructor(
		public escrowWalletId: EscrowWalletId,
		public tokenIdentifier: UUID,
		public registryAddress: EthereumContractAddress,
		public accountAddress: EthereumAccountAddress,
		public label: string | null,
		public tokenUri: string | null,
	) {}

	static actionName = "mintRegistryToken";
}
