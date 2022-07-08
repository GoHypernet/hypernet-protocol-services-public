import {
	BlockchainUnavailableError,
	DatabaseError,
	EscrowWalletId,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumContractAddress,
	RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IRegistryService {
	checkRegistryNameExistence(
		registryName: string,
	): ResultAsync<
		boolean,
		BlockchainUnavailableError | RegistryFactoryContractError
	>;
	createRegistry(
		escrowWalletId: EscrowWalletId,
		name: string,
		symbol: string,
		enumerable: boolean,
	): ResultAsync<
		EthereumContractAddress,
		| BlockchainUnavailableError
		| RegistryFactoryContractError
		| DatabaseError
	>;
}

export const IRegistryServiceType = Symbol.for("IRegistryService");
