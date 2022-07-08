import {
	IMintingService,
	IMintingServiceType,
	IChainTransactionService,
	IChainTransactionServiceType,
	IEscrowWalletService,
	IEscrowWalletServiceType,
	IRegistryService,
	IRegistryServiceType,
} from "@ethereumChainBase/interfaces/business";
import {
	IEthereumRepository,
	IEthereumRepositoryType,
	IHypernetProfileRepository,
	IHypernetProfileRepositoryType,
	IChainTransactionRepository,
	IChainTransactionRepositoryType,
	IChainTokenRepository,
	IChainTokenRepositoryType,
	IEscrowWalletAssetRepository,
	IEscrowWalletAssetRepositoryType,
	IEscrowWalletRepositoryType,
	IEscrowWalletRepository,
} from "@ethereumChainBase/interfaces/data";
import {
	MintingService,
	ChainTransactionService,
	EscrowWalletService,
	RegistryService,
} from "@ethereumChainBase/implementations/business";
import {
	ChainTransactionRepository,
	ChainTokenRepository,
	EthereumRepository,
	HypernetProfileRepository,
	EscrowWalletAssetRepository,
	EscrowWalletRepository,
} from "@ethereumChainBase/implementations/data";
import {
	EventRepository,
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	IJobRepository,
	IJobRepositoryType,
	JobRepository,
} from "@hypernetlabs/hypernet.id-queues";
import {
	ChainServiceRepository,
	IChainServiceRepository,
	IChainServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import { ContainerModule, interfaces } from "inversify";
import {
	IBlockchainProvider,
	IBlockchainProviderType,
} from "@ethereumChainBase/interfaces/utils";
import { BlockchainProvider } from "@ethereumChainBase/implementations/utils";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ethereumChainBase/interfaces/data/utilities";
import { PrismaProvider } from "@ethereumChainBase/implementations/data/utilities";
import { BlockchainListener } from "@ethereumChainBase/implementations/api";
import {
	IBlockchainListener,
	IBlockchainListenerType,
} from "@ethereumChainBase/interfaces/api";

export const chainModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IBlockchainListener>(IBlockchainListenerType)
			.to(BlockchainListener)
			.inSingletonScope();

		bind<IMintingService>(IMintingServiceType)
			.to(MintingService)
			.inSingletonScope();

		bind<IRegistryService>(IRegistryServiceType)
			.to(RegistryService)
			.inSingletonScope();

		bind<IEscrowWalletService>(IEscrowWalletServiceType)
			.to(EscrowWalletService)
			.inSingletonScope();

		bind<IEscrowWalletAssetRepository>(IEscrowWalletAssetRepositoryType)
			.to(EscrowWalletAssetRepository)
			.inSingletonScope();

		bind<IEscrowWalletRepository>(IEscrowWalletRepositoryType)
			.to(EscrowWalletRepository)
			.inSingletonScope();

		bind<IChainTransactionRepository>(IChainTransactionRepositoryType)
			.to(ChainTransactionRepository)
			.inSingletonScope();

		bind<IChainTokenRepository>(IChainTokenRepositoryType)
			.to(ChainTokenRepository)
			.inSingletonScope();

		bind<IChainTransactionService>(IChainTransactionServiceType)
			.to(ChainTransactionService)
			.inSingletonScope();

		bind<IEthereumRepository>(IEthereumRepositoryType)
			.to(EthereumRepository)
			.inSingletonScope();

		bind<IHypernetProfileRepository>(IHypernetProfileRepositoryType)
			.to(HypernetProfileRepository)
			.inSingletonScope();

		bind<IEventRepository>(IEventRepositoryType)
			.to(EventRepository)
			.inSingletonScope();

		bind<IJobRepository>(IJobRepositoryType)
			.to(JobRepository)
			.inSingletonScope();

		bind<IChainServiceRepository>(IChainServiceRepositoryType)
			.to(ChainServiceRepository)
			.inSingletonScope();

		bind<IBlockchainProvider>(IBlockchainProviderType)
			.to(BlockchainProvider)
			.inSingletonScope();

		bind<IPrismaProvider>(IPrismaProviderType)
			.to(PrismaProvider)
			.inSingletonScope();
	},
);
