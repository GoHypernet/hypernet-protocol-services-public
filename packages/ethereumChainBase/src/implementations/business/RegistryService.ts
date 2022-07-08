import { IRegistryService } from "@ethereumChainBase/interfaces/business";
import {
	IEthereumRepository,
	IEthereumRepositoryType,
	IEscrowWalletRepository,
	IEscrowWalletRepositoryType,
} from "@ethereumChainBase/interfaces/data";
import {
	IConfigProviderType,
	IConfigProvider,
} from "@ethereumChainBase/interfaces/utils";
import {
	BlockchainUnavailableError,
	DatabaseError,
	EscrowWalletId,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumContractAddress,
	RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

@injectable()
export class RegistryService implements IRegistryService {
	public constructor(
		@inject(IEthereumRepositoryType)
		protected ethereumRepository: IEthereumRepository,
		@inject(IEscrowWalletRepositoryType)
		protected escrowWalletRepository: IEscrowWalletRepository,
		@inject(IConfigProviderType)
		protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public checkRegistryNameExistence(
		registryName: string,
	): ResultAsync<
		boolean,
		BlockchainUnavailableError | RegistryFactoryContractError
	> {
		return this.ethereumRepository
			.getRegistryAddressByName(registryName)
			.map((registryAddress) => {
				this.logger.info(
					`Registry name ${registryName} has address ${registryAddress}`,
				);
				return registryAddress != null;
			});
	}

	public createRegistry(
		escrowWalletId: EscrowWalletId,
		name: string,
		symbol: string,
		enumerable: boolean,
	): ResultAsync<
		EthereumContractAddress,
		| BlockchainUnavailableError
		| RegistryFactoryContractError
		| DatabaseError
	> {
		return this.escrowWalletRepository
			.getByIds([escrowWalletId])
			.andThen(([escrowWallet]) => {
				return this.ethereumRepository.createRegistry(
					escrowWallet.accountAddress,
					name,
					symbol,
					enumerable,
				);
			});
	}
}
