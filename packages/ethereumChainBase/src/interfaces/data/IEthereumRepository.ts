import { ContractOverrides } from "@hypernetlabs/governance-sdk";
import { MintedIdentityToken } from "@hypernetlabs/hypernet-id-objects";
import {
	BlockchainUnavailableError,
	EncryptionKeyUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	IdentityTokenContent,
	MintBlockchainErrors,
	RedisError,
	RegistryToken,
	TransactionHash,
} from "@hypernetlabs/hypernet.id-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";
import {
	BigNumberString,
	ERC20ContractError,
	EthereumAccountAddress,
	EthereumContractAddress,
	NonFungibleRegistryContractError,
	RegistryFactoryContractError,
	RegistryTokenId,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IEthereumRepository {
	mintIdentityToken(
		accountAddress: EthereumAccountAddress,
		registryTokenId: RegistryTokenId,
		tokenString: IdentityTokenContent,
		encryptedEscrowWalletKeyData: EncryptionResult,
		overrides?: ContractOverrides | null,
	): ResultAsync<
		ethers.providers.TransactionResponse,
		| EthereumReadError
		| EthereumWriteError
		| RedisError
		| MintBlockchainErrors
		| EncryptionKeyUnavailableError
	>;

	mintRegistryToken(
		registryAddress: EthereumContractAddress,
		accountAddress: EthereumAccountAddress,
		registryTokenId: RegistryTokenId,
		tokenString: IdentityTokenContent,
		encryptedEscrowWalletKeyData: EncryptionResult,
		overrides?: ContractOverrides | null,
	): ResultAsync<
		ethers.providers.TransactionResponse,
		| EthereumReadError
		| EthereumWriteError
		| RedisError
		| MintBlockchainErrors
		| EncryptionKeyUnavailableError
	>;

	getIdentityTokenByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	>;

	getBalance(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<BigNumberString, BlockchainUnavailableError>;

	getRegistryTokenByLabel(
		registryAddress: EthereumContractAddress,
		label: string,
	): ResultAsync<
		RegistryToken | null,
		BlockchainUnavailableError | NonFungibleRegistryContractError
	>;

	getRegistrarsForRegistry(
		registryAddress: EthereumContractAddress,
	): ResultAsync<
		EthereumAccountAddress[],
		BlockchainUnavailableError | NonFungibleRegistryContractError
	>;

	getRegistryAddressByName(
		registryName: string,
	): ResultAsync<
		EthereumContractAddress | null,
		BlockchainUnavailableError | RegistryFactoryContractError
	>;

	createRegistry(
		registrarAddress: EthereumAccountAddress,
		registryName: string,
		registrySymbol: string,
		enumerable: boolean,
	): ResultAsync<
		EthereumContractAddress,
		BlockchainUnavailableError | RegistryFactoryContractError
	>;

	checkIdentityTokenExistenceByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		boolean,
		BlockchainUnavailableError | NonFungibleRegistryContractError
	>;

	getLatestBlock(): ResultAsync<
		ethers.providers.Block,
		BlockchainUnavailableError | EthereumReadError
	>;
	getTransaction(
		transactionHash: TransactionHash,
	): ResultAsync<
		ethers.providers.TransactionResponse | null,
		BlockchainUnavailableError | EthereumReadError
	>;
	getTransactions(
		transactionHashes: TransactionHash[],
	): ResultAsync<
		Map<TransactionHash, ethers.providers.TransactionResponse | null>,
		BlockchainUnavailableError | EthereumReadError
	>;
}

export const IEthereumRepositoryType = Symbol.for("IEthereumRepository");
