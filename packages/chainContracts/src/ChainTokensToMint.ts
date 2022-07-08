import { EscrowWalletId } from "@hypernetlabs/hypernet.id-objects";
import { EthereumContractAddress } from "@hypernetlabs/objects";
import { ChainToken } from "@chainContracts/ChainToken";

export class ChainTokensToMint {
	public constructor(
		public escrowWalletId: EscrowWalletId,
		public registryAddress: EthereumContractAddress,
		public chainTokens: ChainToken[],
	) {}
}
