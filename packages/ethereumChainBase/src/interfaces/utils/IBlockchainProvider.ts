import {
	BlockchainUnavailableError,
	EncryptionKeyUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProvider {
	getProvider(): ResultAsync<
		ethers.providers.JsonRpcProvider,
		BlockchainUnavailableError
	>;
	getSigner(
		encryptedEscrowWalletKeyData: EncryptionResult,
	): ResultAsync<
		ethers.Wallet,
		BlockchainUnavailableError | EncryptionKeyUnavailableError
	>;
}

export const IBlockchainProviderType = Symbol.for("IBlockchainProvider");
