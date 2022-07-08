import { IEthereumRepository } from "@ethereumChainBase/interfaces/data";
import {
	IBlockchainProvider,
	IBlockchainProviderType,
	IConfigProvider,
	IConfigProviderType,
} from "@ethereumChainBase/interfaces/utils";
import {
	ContractOverrides,
	ERC20Contract,
	GasUtils,
	NonFungibleRegistryEnumerableUpgradeableContract,
	RegistryFactoryContract,
} from "@hypernetlabs/governance-sdk";
import {
	MintedIdentityToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	EthereumWriteError,
	EthereumReadError,
	BlockchainUnavailableError,
	IdentityTokenContent,
	RedisError,
	RegistryToken,
	MintBlockchainErrors,
	EncryptionKeyUnavailableError,
	TransactionHash,
} from "@hypernetlabs/hypernet.id-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";
import {
	IConcurrencyUtils,
	IConcurrencyUtilsType,
	IdentityContentUtils,
} from "@hypernetlabs/hypernet.id-utils";
import {
	EthereumAccountAddress,
	NonFungibleRegistryContractError,
	RegistryEntry,
	RegistryTokenId,
	BigNumberString,
	EthereumContractAddress,
	ERC20ContractError,
	RegistryName,
	RegistryFactoryContractError,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class EthereumRepository implements IEthereumRepository {
	public constructor(
		@inject(IConcurrencyUtilsType)
		protected concurrencyUtils: IConcurrencyUtils,
		@inject(IBlockchainProviderType)
		protected blockchainProvider: IBlockchainProvider,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public mintIdentityToken(
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
	> {
		// TODO: Make this method take more parameters
		this.logger.info(
			`Minting identity token for account ${accountAddress}`,
		);
		return ResultUtils.combine([
			this.blockchainProvider.getSigner(encryptedEscrowWalletKeyData),
			this.configProvider.getConfig(),
		]).andThen(([signer, config]) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.signer`,
				() => {
					const identityContract =
						new NonFungibleRegistryEnumerableUpgradeableContract(
							signer,
							config.identityRegistryAddress,
						);

					// We need to decide on the token ID, and we should check to make sure it is not taken first.
					// TODO
					this.logger.info(
						`Minting identity token with id ${registryTokenId} on chain ${config.chainId}`,
					);

					return GasUtils.getGasPrice(signer).andThen((feeData) => {
						// There is a bug only happens in Polygon that would prevent us from sending maxFeePerGas and force us to send gasPrice instead.
						let overridesObject = {
							...overrides,
						} as ContractOverrides;

						if (config.specialGasHandling === true) {
							overridesObject = {
								...overrides,
								maxFeePerGas: null,
								gasPrice: feeData.gasPrice,
							} as ContractOverrides;
						}

						return identityContract
							.registerAsync(
								accountAddress,
								"",
								tokenString,
								registryTokenId,
								overridesObject,
							)
							.mapErr((e) => {
								this.logger.error(
									`Error calling identityContract.registerAsync() on chainId: ${config.chainId} for account address: ${accountAddress}`,
									e,
								);
								return e;
							});
					});
				},
				60000,
			);
		});
	}


	public mintRegistryToken(
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
	> {
		// TODO: Make this method take more parameters
		this.logger.info(
			`Minting registry token for account ${accountAddress}`,
		);
		return ResultUtils.combine([
			this.blockchainProvider.getSigner(encryptedEscrowWalletKeyData),
			this.configProvider.getConfig(),
		]).andThen(([signer, config]) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.signer`,
				() => {
					const registryContract =
						new NonFungibleRegistryEnumerableUpgradeableContract(
							signer,
							registryAddress,
						);

					// We need to decide on the token ID, and we should check to make sure it is not taken first.
					// TODO
					this.logger.info(
						`Minting registry token with id ${registryTokenId} on chain ${config.chainId}`,
					);

					return GasUtils.getGasPrice(signer).andThen((feeData) => {
						// There is a bug only happens in Polygon that would prevent us from sending maxFeePerGas and force us to send gasPrice instead.
						let overridesObject = {
							...overrides,
						} as ContractOverrides;

						if (config.specialGasHandling === true) {
							overridesObject = {
								...overrides,
								maxFeePerGas: null,
								gasPrice: feeData.gasPrice,
							} as ContractOverrides;
						}

						return registryContract
							.registerAsync(
								accountAddress,
								"",
								tokenString,
								registryTokenId,
								overridesObject,
							)
							.mapErr((e) => {
								this.logger.error(
									`Error calling registryContract.registerAsync() on chainId: ${config.chainId} for account address: ${accountAddress}`,
									e,
								);
								return e;
							});
					});
				},
				60000,
			);
		});
	}


	public getIdentityTokenByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		MintedIdentityToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const identityContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					config.identityRegistryAddress,
				);
			return identityContract
				.getFirstRegistryEntryByOwnerAddress(accountAddress, true)
				.orElse((e) => {
					this.logger.info(
						`Recovered error calling identityContract.getFirstRegistryEntryByOwnerAddress() on chainId: ${config.chainId} for account address: ${accountAddress}`,
					);
					return okAsync(null);
				})
				.map((registryEntry: RegistryEntry | null) => {
					if (
						registryEntry == null ||
						registryEntry.tokenURI == null
					) {
						return null;
					}
					const identityMetadata =
						IdentityContentUtils.identityTokenContentToIdentityMetadata(
							IdentityTokenContent(registryEntry.tokenURI),
						);

					// Create a new IdentityToken
					return new MintedIdentityToken(
						registryEntry.tokenId,
						config.chainId,
						accountAddress,
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
				});
		});
	}

	// Will get the balance of the chain native token at the latest block
	public getBalance(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<BigNumberString, BlockchainUnavailableError> {
		return this.blockchainProvider.getProvider().andThen((provider) => {
			return ResultAsync.fromPromise(
				provider.getBalance(
					accountAddress,
					"latest",
				) as Promise<ethers.BigNumber>,
				(e) => {
					return new BlockchainUnavailableError(
						"Unable to call provider.getBalance()",
						e,
					);
				},
			).map((balance) =>
				BigNumberString(
					ethers.utils.formatUnits(balance.toString(), "ether"),
				),
			);
		});
	}

	public getRegistryTokenByLabel(
		registryAddress: EthereumContractAddress,
		label: string,
	): ResultAsync<
		RegistryToken | null,
		BlockchainUnavailableError | NonFungibleRegistryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const registryContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					registryAddress,
				);

			return registryContract
				.getRegistryEntryByLabel(label, true)
				.andThen((registryEntry) => {
					if (registryEntry == null) {
						return okAsync(null);
					}

					return okAsync(
						new RegistryToken(
							config.chainId,
							registryAddress,
							registryEntry.tokenId,
							registryEntry.owner,
							registryEntry.label,
							registryEntry.tokenURI,
						),
					);
				})
				.orElse((e) => {
					this.logger.info(
						`Recovered error while calling getRegistryEntryByLabel for label: ${label}, on chain ${config.chainId}, with message: ${e.message}`,
					);

					return okAsync(null);
				});
		});
	}

	public getRegistrarsForRegistry(
		registryAddress: EthereumContractAddress,
	): ResultAsync<
		EthereumAccountAddress[],
		BlockchainUnavailableError | NonFungibleRegistryContractError
	> {
		return this.blockchainProvider.getProvider().andThen((provider) => {
			const registryContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					registryAddress,
				);

			return registryContract.getRegistrarRoleMember(registryAddress);
		});
	}

	public getRegistryAddressByName(
		registryName: string,
	): ResultAsync<
		EthereumContractAddress | null,
		BlockchainUnavailableError | RegistryFactoryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const registryFactoryContract = new RegistryFactoryContract(
				provider,
				config.registryFactoryAddress,
			);

			return registryFactoryContract
				.nameToAddress(RegistryName(registryName))
				.andThen((registryAddress) => {
					// nameToAddress should return null, but it seems to be returning 0x0 at least on Rinkeby.
					// Both mean the registry does not exist.
					if (
						registryAddress == null ||
						registryAddress ==
							"0x0000000000000000000000000000000000000000"
					) {
						return okAsync(null);
					}
					return okAsync(registryAddress);
				})
				.orElse((e) => {
					this.logger.info(
						`Recovered error while calling getRegistryAddressByName for registryName: ${registryName}, on chain ${config.chainId}, with message: ${e.message}`,
					);
					return okAsync(null);
				});
		});
	}

	public createRegistry(
		registrarAddress: EthereumAccountAddress,
		registryName: string,
		registrySymbol: string,
		enumerable: boolean,
	): ResultAsync<
		EthereumContractAddress,
		BlockchainUnavailableError | RegistryFactoryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const registryFactoryContract = new RegistryFactoryContract(
				provider,
				config.registryFactoryAddress,
			);

			return registryFactoryContract
				.createRegistry(
					registryName,
					registrySymbol,
					registrarAddress,
					enumerable,
				)
				.andThen(() => {
					return registryFactoryContract.nameToAddress(
						RegistryName(registryName),
					);
				});
		});
	}

	public checkIdentityTokenExistenceByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		boolean,
		BlockchainUnavailableError | NonFungibleRegistryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const identityContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					config.identityRegistryAddress,
				);
			return identityContract
				.balanceOf(accountAddress)
				.map((numberOfTokens) => {
					return numberOfTokens > 0;
				})
				.orElse((e) => {
					this.logger.info(
						`Recovered error while calling balanceOf on identity registry for account: ${accountAddress}, on chain ${config.chainId}, with message: ${e.message}`,
					);
					return okAsync(false);
				});
		});
	}

	public getLatestBlock(): ResultAsync<
		ethers.providers.Block,
		BlockchainUnavailableError
	> {
		return this.blockchainProvider.getProvider().map(async (provider) => {
			return await provider.getBlock("latest");
		});
	}

	public getTransaction(
		transactionHash: TransactionHash,
	): ResultAsync<
		ethers.providers.TransactionResponse | null,
		BlockchainUnavailableError | EthereumReadError
	> {
		return this.blockchainProvider.getProvider().andThen((provider) => {
			return ResultAsync.fromPromise(
				provider.getTransaction(transactionHash),
				(e) => {
					return new EthereumReadError(
						`Unable to read transaction hash ${transactionHash}`,
						e,
					);
				},
			);
		});
	}

	public getTransactions(
		transactionHashes: TransactionHash[],
	): ResultAsync<
		Map<TransactionHash, ethers.providers.TransactionResponse | null>,
		BlockchainUnavailableError | EthereumReadError
	> {
		const transactionHashesMap: Map<
			TransactionHash,
			ethers.providers.TransactionResponse | null
		> = new Map();

		return ResultUtils.combine(
			transactionHashes.map((transactionHash) =>
				this.getTransaction(transactionHash),
			),
		).andThen((transactionResponses) => {
			transactionResponses.forEach((transactionResponse, index) => {
				transactionHashesMap.set(
					transactionHashes[index],
					transactionResponse,
				);
			});

			return okAsync(transactionHashesMap);
		});
	}
}
