import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { ChainId } from "@hypernetlabs/objects";

export class EstablishEscrowWallet {
	public constructor(public walletPrivateKey: EthereumPrivateKey | null) {}

	static actionName = "EstablishEscrowWallet";
}
