import { IChainTransactionService } from "@ethereumChainBase/interfaces/business";
import {
	IChainTransactionRepositoryType,
	IChainTransactionRepository,
	IChainTokenRepositoryType,
	IChainTokenRepository,
	IEthereumRepository,
	IEthereumRepositoryType,
	IHypernetProfileRepositoryType,
	IHypernetProfileRepository,
	IEscrowWalletRepositoryType,
	IEscrowWalletRepository,
} from "@ethereumChainBase/interfaces/data";
import { EthereumChainBaseConfig } from "@ethereumChainBase/interfaces/objects";
import {
	IConfigProviderType,
	IConfigProvider,
	IBlockchainProviderType,
	IBlockchainProvider,
} from "@ethereumChainBase/interfaces/utils";
import { ContractOverrides, GasUtils } from "@hypernetlabs/governance-sdk";
import {
	MintedIdentityToken,
	MintedProfileToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	ChainStatus,
	ChainToken,
	ChainTransaction,
	NewChainTransaction,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	DatabaseError,
	EscrowWalletId,
	ETransactionStatus,
	TransactionHash,
	BlockchainUnavailableError,
	BlockNumber,
	EventError,
	UserContext,
	ProfileTokenMintedEvent,
	IdentityTokenMintedEvent,
	EthereumReadError,
	EthereumWriteError,
	IdentityTokenContent,
	ETokenType,
	IdentityId,
	MintBlockchainErrors,
	RedisError,
	EncryptionKeyUnavailableError,
	EChainStatus,
} from "@hypernetlabs/hypernet.id-objects";
import { IdentityContentUtils } from "@hypernetlabs/hypernet.id-utils";
import {
	BigNumberString,
	ChainId,
	ERC20ContractError,
	GasPriceError,
	NonFungibleRegistryContractError,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers, utils } from "ethers";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class ChainTransactionService implements IChainTransactionService {
	public constructor(
		@inject(IEthereumRepositoryType)
		protected ethereumRepository: IEthereumRepository,
		@inject(IHypernetProfileRepositoryType)
		protected hypernetProfileRepository: IHypernetProfileRepository,
		@inject(IChainTransactionRepositoryType)
		protected chainTransactionRepository: IChainTransactionRepository,
		@inject(IChainTokenRepositoryType)
		protected chainTokenRepository: IChainTokenRepository,
		@inject(IBlockchainProviderType)
		protected blockchainProvider: IBlockchainProvider,
		@inject(IEscrowWalletRepositoryType)
		protected escrowWalletRepository: IEscrowWalletRepository,
		@inject(IEventRepositoryType)
		protected eventRepository: IEventRepository,
		@inject(IConfigProviderType)
		protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public getByTransactionHash(
		transactionHash: TransactionHash,
	): ResultAsync<ChainTransaction | null, DatabaseError> {
		return this.chainTransactionRepository.getByTransactionHash(
			transactionHash,
		);
	}

	public processBlock(
		userContext: UserContext,
		chainId: ChainId,
		blockNumber: BlockNumber,
	): ResultAsync<
		void,
		| DatabaseError
		| EthereumReadError
		| EthereumWriteError
		| MintBlockchainErrors
		| ERC20ContractError
		| RedisError
		| MintBlockchainErrors
		| NonFungibleRegistryContractError
		| EventError
		| EncryptionKeyUnavailableError
	> {
		this.logger.debug(
			`start processing block ${blockNumber} for chain ${chainId}`,
		);

		return this.getChainTransactionsDetails()
			.andThen(({ minedChainTransactions, pendingChainTransactions }) => {
				// find the lowest nonce in the pending transaction list
				const pendingTransactionWithLowestNonce =
					pendingChainTransactions.reduce((acc, item) => {
						return acc.nonce < item.nonce ? acc : item;
					}, {} as ChainTransaction);

				// Process the lost pending transaction and all of the mined transactions!
				const transactions: ResultAsync<
					void,
					| DatabaseError
					| EthereumReadError
					| EthereumWriteError
					| MintBlockchainErrors
					| ERC20ContractError
					| RedisError
					| MintBlockchainErrors
					| NonFungibleRegistryContractError
					| EventError
					| EncryptionKeyUnavailableError
				>[] = [
					this.processPendingTransaction(
						pendingTransactionWithLowestNonce,
					),
					...minedChainTransactions.map((minedChainTransaction) => {
						return this.processMinedTransaction(
							userContext,
							minedChainTransaction,
						);
					}),
				];
				return ResultUtils.combine(transactions);
			})
			.map(() => {});
	}

	protected chainTransactionCreate(
		escrowWalletId: EscrowWalletId,
		transaction: ethers.providers.TransactionResponse,
	): ResultAsync<ChainTransaction, DatabaseError> {
		return this.configProvider.getConfig().andThen((config) => {
			return this.chainTransactionRepository
				.add([
					new NewChainTransaction(
						config.chainId,
						TransactionHash(transaction.hash),
						config.identityRegistryAddress,
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
						BigNumberString(
							utils.formatEther(transaction.gasLimit),
						),
						transaction.blockNumber
							? BlockNumber(transaction.blockNumber)
							: null,
						BigNumberString(utils.formatEther(transaction.value)),
						transaction.nonce,
						transaction.blockNumber == null
							? ETransactionStatus.Submitted
							: ETransactionStatus.Mined,
						escrowWalletId,
					),
				])
				.map((chainTransactions) => chainTransactions[0]);
		});
	}

	protected getChainTransactionsDetails(): ResultAsync<
		{
			minedChainTransactions: ChainTransaction[];
			pendingChainTransactions: ChainTransaction[];
		},
		DatabaseError | EthereumReadError | BlockchainUnavailableError
	> {
		return this.chainTransactionRepository
			.getSubmittedTransactions()
			.andThen((chainTransactions) => {
				// Check if transactions have been mined
				const chainTransactionsHashes = chainTransactions.map(
					(chainTransaction) => chainTransaction.transactionHash,
				);

				return this.ethereumRepository
					.getTransactions(chainTransactionsHashes)
					.map((transactionResponsesMap) => {
						return Array.from(
							transactionResponsesMap.values(),
						).reduce(
							(acc, transactionResponse, index) => {
								const currentChainTransaction =
									chainTransactions[index];

								if (transactionResponse == null) {
									acc.pendingChainTransactions.push(
										currentChainTransaction,
									);
								} else {
									currentChainTransaction.status =
										ETransactionStatus.Mined;

									acc.minedChainTransactions.push(
										currentChainTransaction,
									);
								}

								return acc;
							},
							{
								pendingChainTransactions: [],
								minedChainTransactions: [],
							} as {
								minedChainTransactions: ChainTransaction[];
								pendingChainTransactions: ChainTransaction[];
							},
						);
					});
			});
	}

	protected processMinedTransaction(
		userContext: UserContext,
		chainTransaction: ChainTransaction,
	): ResultAsync<
		void,
		DatabaseError | EventError | NonFungibleRegistryContractError
	> {
		// Update chain transactions db record with mined chain transaction object
		return this.chainTransactionRepository
			.update(chainTransaction)
			.andThen((minedChainTransaction) => {
				return this.chainTokenRepository.getByChainTransactionId(
					minedChainTransaction.id,
				);
			})
			.andThen((chainTokens) => {
				const profileChainTokens = chainTokens.filter(
					(chainToken) => chainToken.tokenType === ETokenType.Profile,
				);
				const identityChainTokens = chainTokens.filter(
					(chainToken) =>
						chainToken.tokenType === ETokenType.Identity,
				);
				const genericChainTokens = chainTokens.filter(
					(chainToken) => chainToken.tokenType === ETokenType.Generic,
				);

				// Chain transaction is either connected to identity or profile or generic token
				if (profileChainTokens.length > 0) {
					return ResultUtils.combine(
						profileChainTokens.map((profileChainToken) => {
							return this.submitProfileTokenMintedEvent(
								userContext,
								profileChainToken,
							);
						}),
					).map(() => {});
				}

				if (identityChainTokens.length > 0) {
					return ResultUtils.combine(
						identityChainTokens.map((identityChainToken) => {
							return this.submitIdentityTokenMintedEvent(
								userContext,
								identityChainToken,
							);
						}),
					).map(() => {});
				}

				if (genericChainTokens.length > 0) {
					// TODO: handle generic or collection chain tokens once we have collection work ready
					return okAsync(undefined);
				}

				return okAsync(undefined);
			});
	}

	protected submitProfileTokenMintedEvent(
		userContext: UserContext,
		profileChainToken: ChainToken,
	): ResultAsync<void, EventError> {
		if (
			profileChainToken.tokenUri == null ||
			profileChainToken.label == null
		) {
			this.logger.error(
				"Parameters are invalid for submitting ProfileTokenMintedEvent",
			);
			return okAsync(undefined);
		}

		return okAsync(
			this.eventRepository.profileTokenMinted(
				new ProfileTokenMintedEvent(
					userContext,
					IdentityId(profileChainToken.tokenIdentifier),
					new MintedProfileToken(
						profileChainToken.tokenId,
						profileChainToken.chainId,
						profileChainToken.accountAddress,
						profileChainToken.label,
						profileChainToken.tokenUri,
					),
				),
			),
		).map(() => {});
	}

	protected submitIdentityTokenMintedEvent(
		userContext: UserContext,
		identityChainToken: ChainToken,
	): ResultAsync<void, EventError | NonFungibleRegistryContractError> {
		return this.configProvider.getConfig().map((config) => {
			if (identityChainToken.tokenUri == null) {
				throw new Error(
					"Chain token is not actually an identity token!",
				);
			}
			const identityMetadata =
				IdentityContentUtils.identityTokenContentToIdentityMetadata(
					IdentityTokenContent(identityChainToken.tokenUri),
				);

			const mintedIdentityToken = new MintedIdentityToken(
				identityChainToken.tokenId,
				identityChainToken.chainId,
				identityChainToken.accountAddress,
				identityMetadata.timestamp,
				identityMetadata.countryCode,
				identityMetadata.email,
				identityMetadata.firstName,
				identityMetadata.lastName,
				identityMetadata.birthday,
				identityMetadata.placeOfBirth,
				identityMetadata.mailingAddress,
				identityMetadata.residenceAddress,
				identityMetadata.passport,
				identityMetadata.drivingLicense,
				identityMetadata.visa,
				identityMetadata.nationalId,
				identityMetadata.consularId,
				identityMetadata.electoralId,
				identityMetadata.residentPermitId,
				identityMetadata.taxId,
				identityMetadata.studentId,
				identityMetadata.passportCard,
				identityMetadata.militaryId,
				identityMetadata.publicSafetyId,
				identityMetadata.healthId,
				identityMetadata.taxEssentials,
				identityMetadata.socialSecurityNumber,
				identityMetadata.taxNumber,
				identityMetadata.naturalPersonsRegister,
				identityMetadata.generalRegistrationNumber,
				identityMetadata.voterIdNumber,
				identityMetadata.issuingNumber,
				identityMetadata.gender,
				identityMetadata.nationality,
				identityMetadata.livenessImage,
				identityMetadata.motherName,
				identityMetadata.fatherName,
				identityMetadata.verifiedInvestor,
				identityMetadata.underSanctions,
				identityMetadata.activeScreening,
			);

			this.eventRepository.identityTokenMinted(
				new IdentityTokenMintedEvent(
					userContext,
					IdentityId(identityChainToken.tokenIdentifier),
					mintedIdentityToken,
					this.getViewingLink(
						config,
						config.identityRegistryAddress,
						mintedIdentityToken,
					),
				),
			);
		});
	}

	protected processPendingTransaction(
		chainTransaction: ChainTransaction,
	): ResultAsync<
		void,
		| DatabaseError
		| EthereumReadError
		| EthereumWriteError
		| MintBlockchainErrors
		| ERC20ContractError
		| RedisError
		| EncryptionKeyUnavailableError
	> {
		// Update chain transactions db record with mined chain transaction object
		return this.chainTokenRepository
			.getByChainTransactionId(chainTransaction.id)
			.andThen((chainTokens) => {
				const profileChainTokens = chainTokens.filter(
					(chainToken) => chainToken.tokenType === ETokenType.Profile,
				);
				const identityChainTokens = chainTokens.filter(
					(chainToken) =>
						chainToken.tokenType === ETokenType.Identity,
				);
				const genericChainTokens = chainTokens.filter(
					(chainToken) => chainToken.tokenType === ETokenType.Generic,
				);

				// Each profile/identity token has only one transaction hash
				if (profileChainTokens.length > 0) {
					return this.resubmitProfileTokenTransaction(
						chainTransaction,
						profileChainTokens[0],
					);
				}

				if (identityChainTokens.length > 0) {
					return this.resubmitIdentityTokenTransaction(
						chainTransaction,
						identityChainTokens[0],
					);
				}

				if (genericChainTokens.length > 0) {
					// TODO: handle generic or collection chain tokens once we have collection work ready
				}

				return okAsync(undefined);
			});
	}

	protected resubmitProfileTokenTransaction(
		chainTransaction: ChainTransaction,
		profileChainToken: ChainToken,
	): ResultAsync<
		void,
		| DatabaseError
		| EthereumReadError
		| EthereumWriteError
		| MintBlockchainErrors
		| ERC20ContractError
		| RedisError
		| EncryptionKeyUnavailableError
	> {
		return this.escrowWalletRepository
			.getEscrowWalletEncryptedKeyData()
			.andThen((encryptedEscrowWalletKeyData) => {
				if (encryptedEscrowWalletKeyData == null) {
					this.logger.error(
						"Encrypted private key does not exist for minting profile token",
					);
					return okAsync(undefined);
				}

				if (profileChainToken.label == null) {
					this.logger.error("Can't mint profile token without label");
					return okAsync(undefined);
				}

				// Resubmit mint profile token with the updated gas fee data
				return this.hypernetProfileRepository
					.mintHypernetProfileToken(
						profileChainToken.accountAddress,
						profileChainToken.tokenId,
						profileChainToken.label,
						encryptedEscrowWalletKeyData,
						{ nonce: chainTransaction.nonce } as ContractOverrides,
					)
					.andThen((transactionResponse) => {
						// Save new submitted profile transaction in chain transaction db
						return this.chainTransactionCreate(
							chainTransaction.escrowWalletId,
							transactionResponse,
						);
					})
					.andThen((newChainTransaction) => {
						// Update profile chain token with the new submitted transaction id
						profileChainToken.chainTransactionId =
							newChainTransaction.id;
						return this.chainTokenRepository.update(
							profileChainToken,
						);
					})
					.andThen(() => {
						// Update old pending transaction status with replaced to indicate that a new transaction for that profile token has been submitted.
						chainTransaction.status = ETransactionStatus.Replaced;
						return this.chainTransactionRepository.update(
							chainTransaction,
						);
					})
					.map(() => {});
			});
	}

	protected resubmitIdentityTokenTransaction(
		chainTransaction: ChainTransaction,
		identityChainToken: ChainToken,
	): ResultAsync<
		void,
		| DatabaseError
		| EthereumReadError
		| EthereumWriteError
		| MintBlockchainErrors
		| RedisError
		| EncryptionKeyUnavailableError
	> {
		// Get updated gas fees and compare it with the pending transaction gas fee data
		return this.blockchainProvider.getProvider().andThen((provider) => {
			return GasUtils.getGasFee(provider).andThen((feeData) => {
				if (
					feeData.maxFeePerGas != null &&
					chainTransaction.maxFeePerGas != null
				) {
					const currentMaxFeePerGas = BigNumberString(
						utils.formatEther(feeData.maxFeePerGas),
					);

					// If currentMaxFeePerGas is less that chainTransaction maxFeePerGas that means the current transaction is more possible to get mined first so we don't need to resubmit it.
					if (currentMaxFeePerGas < chainTransaction.maxFeePerGas) {
						return okAsync(undefined);
					}
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

						if (identityChainToken.tokenUri == null) {
							const errMessage =
								"identityChainToken does not have tokenUri";
							this.logger.error(errMessage);
							return errAsync(
								new BlockchainUnavailableError(
									errMessage,
									null,
								),
							);
						}

						// Resubmit mint identity token with the updated gas fee data
						return this.ethereumRepository
							.mintIdentityToken(
								identityChainToken.accountAddress,
								identityChainToken.tokenId,
								IdentityTokenContent(
									identityChainToken.tokenUri,
								),
								encryptedEscrowWalletKeyData,
								{
									nonce: chainTransaction.nonce,
								} as ContractOverrides,
							)
							.andThen((transactionResponse) => {
								// Save new submitted identity transaction in chain transaction db
								return this.chainTransactionCreate(
									chainTransaction.escrowWalletId,
									transactionResponse,
								);
							})
							.andThen((newChainTransaction) => {
								// update identity chain token with the new submitted transaction id
								identityChainToken.chainTransactionId =
									newChainTransaction.id;
								return this.chainTokenRepository.update(
									identityChainToken,
								);
							})
							.andThen(() => {
								// Update old pending transaction status with replaced to indicate that a new transaction for that identity token has been submitted.
								chainTransaction.status =
									ETransactionStatus.Replaced;
								return this.chainTransactionRepository.update(
									chainTransaction,
								);
							})
							.map(() => {});
					});
			});
		});
	}

	protected getViewingLink(
		config: EthereumChainBaseConfig,
		identityRegistryAddress: string,
		mintedToken: MintedIdentityToken,
	): string {
		const tokenId = mintedToken.tokenId;

		const url = `${config.viewingLinkBaseUrl}/token/${identityRegistryAddress}?a=${tokenId}`;
		return url;
	}

	public getChainHealthStatus(): ResultAsync<
		ChainStatus,
		| DatabaseError
		| BlockchainUnavailableError
		| NonFungibleRegistryContractError
	> {
		return this.configProvider.getConfig().andThen((config) => {
			return this.escrowWalletRepository
				.getDefaultEscrowWallet()
				.andThen((defaultEscrowWallet) => {
					if (defaultEscrowWallet == null) {
						return okAsync(
							new ChainStatus(
								config.chainId,
								null,
								null,
								null,
								config.hypertokenAddress != null,
								false,
								false,
								EChainStatus.Unhealthy,
								["Default escrow wallet is not found"],
							),
						);
					}

					return ResultUtils.combine([
						this.ethereumRepository.getBalance(
							defaultEscrowWallet.accountAddress,
						),
						this.ethereumRepository.getRegistrarsForRegistry(
							config.profileRegistryAddress,
						),
						this.ethereumRepository.getRegistrarsForRegistry(
							config.identityRegistryAddress,
						),
					])
						.andThen(
							([
								balance,
								profileRegistrars,
								identityRegistrars,
							]) => {
								return okAsync(
									new ChainStatus(
										config.chainId,
										defaultEscrowWallet.id,
										defaultEscrowWallet.accountAddress,
										balance,
										config.hypertokenAddress != null,
										profileRegistrars.includes(
											defaultEscrowWallet.accountAddress,
										),
										identityRegistrars.includes(
											defaultEscrowWallet.accountAddress,
										),
										EChainStatus.Healthy,
										[],
									),
								);
							},
						)
						.orElse((e) => {
							return okAsync(
								new ChainStatus(
									config.chainId,
									defaultEscrowWallet.id,
									defaultEscrowWallet.accountAddress,
									null,
									config.hypertokenAddress != null,
									false,
									false,
									EChainStatus.Error,
									[e.message],
								),
							);
						});
				})
				.orElse((e) => {
					return okAsync(
						new ChainStatus(
							config.chainId,
							null,
							null,
							null,
							false,
							false,
							false,
							EChainStatus.Error,
							[e.message],
						),
					);
				});
		});
	}
}
