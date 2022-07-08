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
	IConfigProvider,
	IConfigProviderType,
} from "@ethereumChainBase/interfaces/utils";
import {
	GetIdentityToken,
	GetChainTransactionByTransactionHash,
	GetProfileToken,
	MintIdentityToken,
	MintProfileToken,
	getChainInfoByChainId,
	EstablishEscrowWallet,
	MintRegistryToken,
	CheckRegistryNameExistence,
	CreateRegistry,
	GetChainStatus,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	ContextMeta,
	MintHypernetProfileTokenJob,
	MintIdentityTokenJob,
	MintRegistryTokenJob,
	ProcessBlockJob,
} from "@hypernetlabs/hypernet.id-objects";
import {
	JobProcessor,
	SecureService,
} from "@hypernetlabs/hypernet.id-security";
import { ChainId } from "@hypernetlabs/objects";
import { ContainerModule } from "inversify";
import { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { okAsync, ResultAsync } from "neverthrow";

import {
	IBlockchainListener,
	IBlockchainListenerType,
} from "@ethereumChainBase/interfaces/api";

export abstract class ChainService extends SecureService {
	public abstract getChainId(): ChainId;

	public abstract modules(): ContainerModule[];

	public onStarted(
		ctx: Context<unknown, ContextMeta>,
	): ResultAsync<void, unknown> {
		const configProvider =
			this.container.get<IConfigProvider>(IConfigProviderType);

		return configProvider.getConfig().andThen((config) => {
			if (config.chainEnabled === true) {
				const blockchainListener =
					this.container.get<IBlockchainListener>(
						IBlockchainListenerType,
					);

				return blockchainListener.initialize();
			}

			return okAsync(undefined);
		});
	}

	public getServiceName(): string {
		return getChainInfoByChainId(this.getChainId()).service;
	}

	public getQueueProcessors(): JobProcessor[] {
		return [
			new JobProcessor<MintHypernetProfileTokenJob, IMintingService>(
				`Chain-${this.getChainId()}-HypernetProfileTokenMint`,
				IMintingServiceType,
				(job, ruc, mintingService) => {
					return mintingService
						.doHypernetProfileMinting(job.chainTokenId)
						.map(() => {});
				},
			),
			new JobProcessor<MintIdentityTokenJob, IMintingService>(
				`Chain-${this.getChainId()}-IdentityTokenMint`,
				IMintingServiceType,
				(job, ruc, mintingService) => {
					return mintingService
						.doIdentityTokenMinting(job.chainTokenId)
						.map(() => {});
				},
			),
			new JobProcessor<MintRegistryTokenJob, IMintingService>(
				`Chain-${this.getChainId()}-RegistryTokenMint`,
				IMintingServiceType,
				(job, ruc, mintingService) => {
					return mintingService
						.doRegistryTokenMinting(job.chainTokenId)
						.map(() => {});
				},
			),
			new JobProcessor<ProcessBlockJob, IChainTransactionService>(
				`Chain-${this.getChainId()}-ProcessBlock`,
				IChainTransactionServiceType,
				(job, ruc, chainTransactionService) => {
					return chainTransactionService
						.processBlock(ruc, job.chainId, job.blockNumber)
						.map(() => {});
				},
			),
		];
	}

	public getServiceSchema(): Partial<ServiceSchema<ServiceSettingSchema>> {
		return {
			actions: {
				[GetChainStatus.actionName]: {
					params: {},
					handler: async (
						ctx: Context<GetChainStatus, ContextMeta>,
					) => {
						return this.signedActionHandler<IChainTransactionService>(
							ctx,
							IChainTransactionServiceType,
							(ruc, cainTransactionService) => {
								return cainTransactionService.getChainHealthStatus();
							},
						);
					},
				},
				[MintIdentityToken.actionName]: {
					params: {},
					handler: async (
						ctx: Context<MintIdentityToken, ContextMeta>,
					) => {
						return this.signedActionHandler<IMintingService>(
							ctx,
							IMintingServiceType,
							(ruc, mintingService) => {
								return mintingService.mintIdentityToken(
									ruc,
									ctx.params.identity,
									ctx.params.accountAddress,
								);
							},
						);
					},
				},
				[MintProfileToken.actionName]: {
					params: {},
					handler: async (
						ctx: Context<MintProfileToken, ContextMeta>,
					) => {
						return this.signedActionHandler<IMintingService>(
							ctx,
							IMintingServiceType,
							(ruc, mintingService) => {
								return mintingService.mintProfileToken(
									ruc,
									ctx.params.identityId,
									ctx.params.username,
									ctx.params.accountAddress,
								);
							},
						);
					},
				},
				[MintRegistryToken.actionName]: {
					params: {},
					handler: async (
						ctx: Context<MintRegistryToken, ContextMeta>,
					) => {
						return this.signedActionHandler<IMintingService>(
							ctx,
							IMintingServiceType,
							(ruc, mintingService) => {
								return mintingService.mintRegistryToken(
									ruc,
									ctx.params.escrowWalletId,
									ctx.params.tokenIdentifier,
									ctx.params.registryAddress,
									ctx.params.accountAddress,
									ctx.params.label,
									ctx.params.tokenUri,
								);
							},
						);
					},
				},
				[GetIdentityToken.actionName]: {
					params: {
						accountAddress: { type: "string" },
					},
					handler: async (
						ctx: Context<GetIdentityToken, ContextMeta>,
					) => {
						return this.signedActionHandler<IMintingService>(
							ctx,
							IMintingServiceType,
							(ruc, mintingService) => {
								return mintingService.getIdentityToken(
									ctx.params.accountAddress,
								);
							},
						);
					},
				},
				[GetProfileToken.actionName]: {
					params: {
						accountAddress: { type: "string" },
					},
					handler: async (
						ctx: Context<GetProfileToken, ContextMeta>,
					) => {
						return this.signedActionHandler<IMintingService>(
							ctx,
							IMintingServiceType,
							(ruc, mintingService) => {
								return mintingService.getProfileToken(
									ctx.params.accountAddress,
								);
							},
						);
					},
				},
				[GetChainTransactionByTransactionHash.actionName]: {
					params: {
						transactionHash: { type: "string" },
					},
					handler: async (
						ctx: Context<
							GetChainTransactionByTransactionHash,
							ContextMeta
						>,
					) => {
						return this.signedActionHandler<IChainTransactionService>(
							ctx,
							IChainTransactionServiceType,
							(ruc, chainTransactionService) => {
								return chainTransactionService.getByTransactionHash(
									ctx.params.transactionHash,
								);
							},
						);
					},
				},
				[EstablishEscrowWallet.actionName]: {
					handler: async (
						ctx: Context<EstablishEscrowWallet, ContextMeta>,
					) => {
						return this.signedActionHandler<IEscrowWalletService>(
							ctx,
							IEscrowWalletServiceType,
							(ruc, escrowWalletService) => {
								return escrowWalletService.establishEscrowWallet(
									this.getChainId(),
									ctx.params.walletPrivateKey,
								);
							},
						);
					},
				},
				[CheckRegistryNameExistence.actionName]: {
					params: {
						name: { type: "string" },
					},
					handler: async (
						ctx: Context<CheckRegistryNameExistence, ContextMeta>,
					) => {
						return this.signedActionHandler<IRegistryService>(
							ctx,
							IRegistryServiceType,
							(ruc, registryService) => {
								return registryService.checkRegistryNameExistence(
									ctx.params.name,
								);
							},
						);
					},
				},
				[CreateRegistry.actionName]: {
					params: {},
					handler: async (
						ctx: Context<CreateRegistry, ContextMeta>,
					) => {
						return this.signedActionHandler<IRegistryService>(
							ctx,
							IRegistryServiceType,
							(ruc, registryService) => {
								return registryService.createRegistry(
									ctx.params.escrowWalletId,
									ctx.params.name,
									ctx.params.symbol,
									ctx.params.enumerable,
								);
							},
						);
					},
				},
			},
		};
	}
}
