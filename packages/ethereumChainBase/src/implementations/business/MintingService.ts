import { IMintingService } from "@ethereumChainBase/interfaces/business";
import {
	IEthereumRepository,
	IEthereumRepositoryType,
	IHypernetProfileRepository,
	IHypernetProfileRepositoryType,
	IChainTokenRepository,
	IChainTokenRepositoryType,
	IChainTransactionRepository,
	IChainTransactionRepositoryType,
	IEscrowWalletRepository,
	IEscrowWalletRepositoryType,
} from "@ethereumChainBase/interfaces/data";
import {
	IConfigProviderType,
	IConfigProvider,
} from "@ethereumChainBase/interfaces/utils";
import {
	MintedIdentityToken,
	MintedProfileToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	ChainToken,
	ChainTransaction,
	NewChainToken,
	NewChainTransaction,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	BlockchainUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	IdentityDoc,
	IdentityId,
	MintingDeniedError,
	QueueError,
	RedisError,
	UserContext,
	UsernameString,
	MintHypernetProfileTokenJob,
	MintIdentityTokenJob,
	TransactionHash,
	ETransactionStatus,
	BlockNumber,
	DatabaseError,
	IdentityTokenContent,
	EscrowWalletId,
	ETokenType,
	RegistryToken,
	MintRegistryTokenJob,
	UnknownEntityError,
	MintBlockchainErrors,
	EncryptionKeyUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	IJobRepository,
	IJobRepositoryType,
} from "@hypernetlabs/hypernet.id-queues";
import {
	IConcurrencyUtils,
	IConcurrencyUtilsType,
	IdentityContentUtils,
} from "@hypernetlabs/hypernet.id-utils";
import {
	ERC20ContractError,
	EthereumAccountAddress,
	NonFungibleRegistryContractError,
	BigNumberString,
	RegistryTokenId,
	UUID,
	EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { BigNumber, utils, ethers } from "ethers";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class MintingService implements IMintingService {
	public constructor(
		@inject(IEthereumRepositoryType)
		protected ethereumRepository: IEthereumRepository,
		@inject(IHypernetProfileRepositoryType)
		protected hypernetProfileRepository: IHypernetProfileRepository,
		@inject(IChainTokenRepositoryType)
		protected chainTokenRepository: IChainTokenRepository,
		@inject(IChainTransactionRepositoryType)
		protected chainTransactionRepository: IChainTransactionRepository,
		@inject(IEscrowWalletRepositoryType)
		protected escrowWalletRepository: IEscrowWalletRepository,
		@inject(IConcurrencyUtilsType)
		protected concurrencyUtils: IConcurrencyUtils,
		@inject(IConfigProviderType)
		protected configProvider: IConfigProvider,
		@inject(IJobRepositoryType) protected jobRepository: IJobRepository,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public mintIdentityToken(
		userContext: UserContext,
		identity: IdentityDoc,
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| QueueError
		| MintingDeniedError
		| RedisError
		| DatabaseError
	> {
		return this.configProvider.getConfig().andThen((config) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.identity.${accountAddress}`,
				() => {
					return this.escrowWalletRepository
						.getDefaultEscrowWallet()
						.andThen((defaultEscrowWallet) => {
							// We don't want to proceed if escrow wallet doesn't have registrar role for the requested registry address.
							return this.ensureRegistrarRole(
								config.identityRegistryAddress,
								defaultEscrowWallet.accountAddress,
							)
								.andThen(() => {
									return this.ethereumRepository.checkIdentityTokenExistenceByAccount(
										accountAddress,
									);
								})
								.andThen((hasTokens) => {
									if (hasTokens) {
										return this.ethereumRepository.getIdentityTokenByAccount(
											accountAddress,
										);
									}
									const tokenString =
										IdentityContentUtils.identityMetadataToIdentityTokenContent(
											identity.identityMetadata,
											identity.countryCode,
											identity.timestamp,
										);

									this.logger.info(
										`identity.countryCode ${identity.countryCode}`,
									);
									this.logger.info(
										`tokenString ${tokenString}`,
									);

									const chainToken = new NewChainToken(
										config.chainId,
										config.identityRegistryAddress,
										this.generateTokenId(),
										accountAddress,
										"",
										tokenString,
										ETokenType.Identity,
										UUID(identity.identityId),
										null,
										defaultEscrowWallet.id,
									);
									return this.chainTokenRepository
										.getByChainToken(chainToken)
										.andThen((existedChainToken) => {
											if (existedChainToken != null) {
												return okAsync(null);
											}
											return this.chainTokenRepository
												.add([chainToken])
												.andThen(([chainToken]) => {
													return this.jobRepository
														.sendMintIdentityTokenJob(
															new MintIdentityTokenJob(
																userContext,
																config.chainId,
																chainToken.id,
																identity,
															),
														)
														.map(() => null);
												});
										});
								});
						});
				},
			);
		});
	}

	public mintProfileToken(
		userContext: UserContext,
		identityId: IdentityId,
		username: UsernameString | null,
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedProfileToken | null,
		| EthereumReadError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
		| DatabaseError
		| QueueError
		| RedisError
		| MintingDeniedError
	> {
		if (username == null) {
			return errAsync(
				new MintingDeniedError(
					`Identity ${identityId} is missing a username, cannot mint profile token`,
				),
			);
		}
		return this.configProvider.getConfig().andThen((config) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.profile.${accountAddress}`,
				() => {
					return ResultUtils.combine([
						this.escrowWalletRepository.getDefaultEscrowWallet(),
						this.hypernetProfileRepository.getProfileTokenByUsername(
							username,
						),
					]).andThen(([defaultEscrowWallet, profile]) => {
						if (profile != null) {
							// return the existing profile
							return okAsync(profile);
						}
						const chainToken = new NewChainToken(
							config.chainId,
							config.profileRegistryAddress,
							this.generateTokenId(),
							accountAddress,
							username,
							"",
							ETokenType.Profile,
							UUID(identityId),
							null,
							defaultEscrowWallet.id,
						);
						return this.chainTokenRepository
							.getByChainToken(chainToken)
							.andThen((existedChainToken) => {
								if (existedChainToken != null) {
									return okAsync(null);
								}
								return this.chainTokenRepository
									.add([chainToken])
									.andThen(([chainToken]) => {
										return this.jobRepository.sendMintHypernetProfileTokenJob(
											new MintHypernetProfileTokenJob(
												userContext,
												config.chainId,
												chainToken.id,
											),
										);
									})
									.map(() => null);
							});
					});
				},
			);
		});
	}

	public mintRegistryToken(
		userContext: UserContext,
		escrowWalletId: EscrowWalletId,
		tokenIdentifier: UUID,
		registryAddress: EthereumContractAddress,
		accountAddress: EthereumAccountAddress,
		label: string | null,
		tokenUri: string | null,
	): ResultAsync<
		void,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
		| RedisError
		| QueueError
		| MintingDeniedError
		| DatabaseError
		| UnknownEntityError
	> {
		return this.configProvider.getConfig().andThen((config) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.tokenToRegistry.${accountAddress}`,
				() => {
					return this.escrowWalletRepository
						.getByIds([escrowWalletId])
						.andThen(([escrowWallet]) => {
							if (escrowWallet == null) {
								return errAsync(
									new UnknownEntityError(
										`Counld not find escrow wallet for id: ${escrowWalletId}`,
									),
								);
							}

							// We don't want to proceed if escrow wallet doesn't have registrar role for the requested registry address.
							return this.ensureRegistrarRole(
								registryAddress,
								escrowWallet.accountAddress,
							).andThen(() => {
								let labelLookupResult: ResultAsync<
									RegistryToken | null | undefined,
									| BlockchainUnavailableError
									| NonFungibleRegistryContractError
								>;
								if (label != null) {
									labelLookupResult =
										this.ethereumRepository.getRegistryTokenByLabel(
											registryAddress,
											label,
										);
								} else {
									labelLookupResult = okAsync(undefined);
								}

								return labelLookupResult.andThen(
									(registryToken) => {
										if (registryToken != null) {
											return errAsync(
												new MintingDeniedError(
													`Label ${label} is already exist in registry ${registryAddress}`,
												),
											);
										}

										const chainToken = new NewChainToken(
											config.chainId,
											registryAddress,
											this.generateTokenId(),
											accountAddress,
											label,
											tokenUri,
											ETokenType.Generic,
											tokenIdentifier,
											null,
											escrowWallet.id,
										);
										return this.chainTokenRepository
											.getByChainToken(chainToken)
											.andThen((existedChainToken) => {
												if (existedChainToken == null) {
													return this.chainTokenRepository.add(
														[chainToken],
													);
												}
												return okAsync([
													existedChainToken,
												]);
											})
											.andThen(([chainToken]) => {
												return this.jobRepository
													.sendMintRegistryTokenJob(
														new MintRegistryTokenJob(
															userContext,
															config.chainId,
															chainToken.id,
														),
													)
													.map(() => {});
											});
									},
								);
							});
						});
				},
			);
		});
	}

	public doHypernetProfileMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| DatabaseError
		| RedisError
		| MintBlockchainErrors
		| ERC20ContractError
		| EthereumWriteError
		| EncryptionKeyUnavailableError
	> {
		return this.chainTokenRepository
			.getById(chainTokenId)
			.andThen((chainToken) => {
				if (chainToken == null) {
					this.logger.error(`token ${chainTokenId} does not exist`);
					return okAsync(undefined);
				}

				if (chainToken.label == null) {
					this.logger.error(
						`token ${chainToken?.id} is missing a username, cannot mint profile token`,
					);
					return okAsync(undefined);
				}

				if (chainToken.tokenType != ETokenType.Profile) {
					this.logger.error(
						`token ${chainToken?.id} is not a profile type token`,
					);
					return okAsync(undefined);
				}
				const username = UsernameString(chainToken.label);

				return this.hypernetProfileRepository
					.getProfileTokenByUsername(username)
					.andThen((profile) => {
						if (profile != null) {
							// This is a wierd case- somewhere between when we created this job and processed this job,
							// Somebody created a profile token!
							this.logger.warn(
								`While minting a Profile token, we found an existing token while processing the job. This means a Profile token was added to the registry between when we created this job and when we processed it`,
							);
							return okAsync(undefined);
						}
						return this.escrowWalletRepository
							.getEscrowWalletEncryptedKeyData()
							.andThen((encryptedEscrowWalletKeyData) => {
								if (encryptedEscrowWalletKeyData == null) {
									this.logger.error(
										"Encrypted private key does not exist for minting profile token",
									);
									return okAsync(undefined);
								}

								return this.hypernetProfileRepository
									.mintHypernetProfileToken(
										chainToken.accountAddress,
										chainToken.tokenId,
										username,
										encryptedEscrowWalletKeyData,
									)
									.andThen((transaction) => {
										return this.chainTransactionCreate(
											chainToken,
											transaction,
										);
									});
							});
					});
			});
	}

	public doIdentityTokenMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| RedisError
		| DatabaseError
		| MintBlockchainErrors
		| EthereumWriteError
		| EncryptionKeyUnavailableError
	> {
		return this.chainTokenRepository
			.getById(chainTokenId)
			.andThen((chainToken) => {
				if (chainToken == null) {
					this.logger.error(`token ${chainTokenId} does not exist`);
					return okAsync(undefined);
				}

				if (chainToken.tokenType != ETokenType.Identity) {
					this.logger.error(
						`token ${chainToken?.id} is not an identity type token`,
					);
					return okAsync(undefined);
				}

				return this.ethereumRepository
					.checkIdentityTokenExistenceByAccount(
						chainToken.accountAddress,
					)
					.andThen((hasTokens) => {
						if (hasTokens) {
							return okAsync(undefined);
						}
						return this.escrowWalletRepository
							.getEscrowWalletEncryptedKeyData()
							.andThen((encryptedEscrowWalletKeyData) => {
								if (encryptedEscrowWalletKeyData == null) {
									this.logger.error(
										"Encrypted private key does not exist for minting identity token",
									);
									return okAsync(undefined);
								}

								if (chainToken.tokenUri == null) {
									this.logger.error(
										`token ${chainToken?.id} does not have IdentityTokenContent (tokenUri)`,
									);
									return okAsync(undefined);
								}

								return this.ethereumRepository
									.mintIdentityToken(
										chainToken.accountAddress,
										chainToken.tokenId,
										IdentityTokenContent(
											chainToken.tokenUri,
										),
										encryptedEscrowWalletKeyData,
									)
									.andThen((transaction) => {
										return this.chainTransactionCreate(
											chainToken,
											transaction,
										);
									});
							});
					});
			});
	}

	public doRegistryTokenMinting(
		chainTokenId: UUID,
	): ResultAsync<
		void,
		| EthereumReadError
		| RedisError
		| DatabaseError
		| MintBlockchainErrors
		| EthereumWriteError
		| EncryptionKeyUnavailableError
	> {
		return this.chainTokenRepository
			.getById(chainTokenId)
			.andThen((chainToken) => {
				if (chainToken == null) {
					this.logger.error(`token ${chainTokenId} does not exist`);
					return okAsync(undefined);
				}

				if (chainToken.tokenType != ETokenType.Generic) {
					this.logger.error(
						`token ${chainToken?.id} is not an registry type token`,
					);
					return okAsync(undefined);
				}

				return this.escrowWalletRepository
					.getEscrowWalletEncryptedKeyData()
					.andThen((encryptedEscrowWalletKeyData) => {
						if (encryptedEscrowWalletKeyData == null) {
							this.logger.error(
								"Encrypted private key does not exist for minting registry token",
							);
							return okAsync(undefined);
						}

						if (chainToken.tokenUri == null) {
							this.logger.error(
								`token ${chainToken?.id} does not have RegistryTokenContent (tokenUri)`,
							);
							return okAsync(undefined);
						}

						return this.ethereumRepository
							.mintRegistryToken(
								chainToken.registryAddress,
								chainToken.accountAddress,
								chainToken.tokenId,
								IdentityTokenContent(chainToken.tokenUri),
								encryptedEscrowWalletKeyData,
							)
							.andThen((transaction) => {
								return this.chainTransactionCreate(
									chainToken,
									transaction,
								);
							});
					});
			});
	}

	public getIdentityToken(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return this.ethereumRepository.getIdentityTokenByAccount(
			accountAddress,
		);
	}

	public getProfileToken(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return this.hypernetProfileRepository.getProfileTokenByAccount(
			accountAddress,
		);
	}

	public getProfileTokenByUsername(
		userContext: UserContext,
		username: UsernameString,
	): ResultAsync<
		MintedProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return this.hypernetProfileRepository.getProfileTokenByUsername(
			username,
		);
	}

	protected chainTransactionCreate(
		chainToken: ChainToken,
		transaction: ethers.providers.TransactionResponse,
	): ResultAsync<void, DatabaseError> {
		return this.chainTransactionRepository
			.add([
				new NewChainTransaction(
					chainToken.chainId,
					TransactionHash(transaction.hash),
					chainToken.registryAddress,
					transaction.maxFeePerGas
						? BigNumberString(
								utils.formatEther(transaction.maxFeePerGas),
						  )
						: null,
					transaction.maxPriorityFeePerGas
						? BigNumberString(
								utils.formatEther(
									transaction.maxPriorityFeePerGas,
								),
						  )
						: null,
					BigNumberString(utils.formatEther(transaction.gasLimit)),
					transaction.blockNumber
						? BlockNumber(transaction.blockNumber)
						: null,
					BigNumberString(utils.formatEther(transaction.value)),
					transaction.nonce,
					transaction.blockNumber == null
						? ETransactionStatus.Submitted
						: ETransactionStatus.Mined,
					chainToken.escrowWalletId,
				),
			])
			.andThen(([chainTransaction]) => {
				chainToken.chainTransactionId = chainTransaction.id;
				return this.chainTokenRepository.update(chainToken);
			})
			.map(() => {
				// TODO- If there is an error somewhere in here, we need roll back the DB updates.
			});
	}

	protected generateTokenId(): RegistryTokenId {
		return RegistryTokenId(
			BigNumber.from(Math.floor(Math.random() * 2147483647)).toString(),
		);
	}

	protected ensureRegistrarRole(
		registryAddress: EthereumContractAddress,
		escrowWalletAccountAddress: EthereumAccountAddress,
	): ResultAsync<
		void,
		| MintingDeniedError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
	> {
		return this.ethereumRepository
			.getRegistrarsForRegistry(registryAddress)
			.andThen((registrars) => {
				if (registrars.includes(escrowWalletAccountAddress) === false) {
					return errAsync(
						new MintingDeniedError(
							`escrow wallet account address: ${escrowWalletAccountAddress} is not registrar for registry ${registryAddress}`,
						),
					);
				}

				return okAsync(undefined);
			});
	}
}
