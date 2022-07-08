import { ContractOverrides } from "@hypernetlabs/governance-sdk";
import {
	BlockchainUnavailableError,
	EncryptionKeyUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	HypernetProfileToken,
	MintBlockchainErrors,
	RedisError,
	UsernameString,
} from "@hypernetlabs/hypernet.id-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";
import {
	ERC20ContractError,
	EthereumAccountAddress,
	NonFungibleRegistryContractError,
	RegistryTokenId,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IHypernetProfileRepository {
	mintHypernetProfileToken(
		accountAddress: EthereumAccountAddress,
		registryTokenId: RegistryTokenId,
		username: string,
		encryptedEscrowWalletKeyData: EncryptionResult,
		overrides?: ContractOverrides | null,
	): ResultAsync<
		ethers.providers.TransactionResponse,
		| EthereumReadError
		| EthereumWriteError
		| ERC20ContractError
		| RedisError
		| MintBlockchainErrors
		| EncryptionKeyUnavailableError
	>;

	getProfileTokenByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		HypernetProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;
	getProfileTokenByUsername(
		username: UsernameString,
	): ResultAsync<
		HypernetProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;
}

export const IHypernetProfileRepositoryType = Symbol.for(
	"IHypernetProfileRepository",
);
