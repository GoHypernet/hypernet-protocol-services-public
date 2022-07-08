import { NewEscrowWallet } from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	InitializationVector,
	EncryptedString,
} from "@hypernetlabs/common-objects";
import { ChainId, EthereumAccountAddress } from "@hypernetlabs/objects";

export class NewEscrowWalletWithKeys extends NewEscrowWallet {
	public constructor(
		public chainId: ChainId,
		public accountAddress: EthereumAccountAddress,
		public privateKeyE: EncryptedString,
		public privateKeyIv: InitializationVector,
		public encryptionKeyVersion: number,
		public defaultWallet: boolean,
	) {
		super(chainId, accountAddress);
	}
}
