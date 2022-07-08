import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { EscrowWallet } from "@hypernetlabs/hypernet.id-chain-contracts";
import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { ChainId } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IEscrowWalletService {
	establishEscrowWallet(
		chainId: ChainId,
		walletPrivateKey?: EthereumPrivateKey | null,
	): ResultAsync<EscrowWallet, DatabaseError>;
}

export const IEscrowWalletServiceType = Symbol.for("IEscrowWalletService");
