/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IHypernetProfileRepository } from "@ethereumChainBase/interfaces/data";
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
} from "@hypernetlabs/governance-sdk";
import {
	EthereumWriteError,
	EthereumReadError,
	BlockchainUnavailableError,
	HypernetProfileToken,
	RedisError,
	UsernameString,
	MintBlockchainErrors,
	EncryptionKeyUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";
import {
	IConcurrencyUtils,
	IConcurrencyUtilsType,
} from "@hypernetlabs/hypernet.id-utils";
import {
	ERC20ContractError,
	EthereumAccountAddress,
	NonFungibleRegistryContractError,
	RegistryEntry,
	RegistryTokenId,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class HypernetProfileRepository implements IHypernetProfileRepository {
	public constructor(
		@inject(IConcurrencyUtilsType)
		protected concurrencyUtils: IConcurrencyUtils,
		@inject(IBlockchainProviderType)
		protected blockchainProvider: IBlockchainProvider,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public mintHypernetProfileToken(
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
	> {
		this.logger.info(`Minting profile token for account ${accountAddress}`);

		return ResultUtils.combine([
			this.blockchainProvider.getSigner(encryptedEscrowWalletKeyData),
			this.configProvider.getConfig(),
		]).andThen(([signer, config]) => {
			return this.concurrencyUtils.performWithLock(
				`chain.${config.chainId}.signer`,
				() => {
					const profileRegistryContract =
						new NonFungibleRegistryEnumerableUpgradeableContract(
							signer,
							config.profileRegistryAddress,
						);

					this.logger.info(
						`Minting profile token with id ${registryTokenId} on chain ${config.chainId}`,
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

						// TODO: Lookup if there is already a token with that ID
						if (config.hypertokenAddress != null) {
							return profileRegistryContract
								.registrationFeeBigNumber()
								.andThen((registrationFees) => {
									const hypertokenContract =
										new ERC20Contract(
											signer,
											config.hypertokenAddress!,
										);

									this.logger.debug(`registrationFees`);
									this.logger.debug(registrationFees);

									return hypertokenContract.approve(
										config.profileRegistryAddress,
										registrationFees,
									);
								})
								.andThen(() => {
									return profileRegistryContract
										.registerByTokenAsync(
											accountAddress,
											username,
											"",
											registryTokenId,
											overridesObject,
										)
										.mapErr((e) => {
											console.log(
												"Error calling profileRegistryContract.registerByTokenAsync(): ",
												e,
											);
											return e;
										});
								});
						}
						// No hypertoken on the chain
						return profileRegistryContract
							.registerAsync(
								accountAddress,
								username,
								"",
								registryTokenId,
								overridesObject,
							)
							.mapErr((e) => {
								this.logger.error(
									`Error calling profileRegistryContract.registerAsync() on chainId: ${config.chainId} for account address: ${accountAddress}`,
									e,
								);
								return e;
							});
					});
				},
			);
		});
	}

	public getProfileTokenByAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<
		HypernetProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const profileContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					config.profileRegistryAddress,
				);

			return profileContract
				.getFirstRegistryEntryByOwnerAddress(accountAddress, true)
				.orElse((e) => {
					this.logger.info(
						`Recovered error calling profileContract.getFirstRegistryEntryByOwnerAddress() on chainId: ${config.chainId} for account address: ${accountAddress}`,
					);
					return okAsync(null);
				})
				.map((registryEntry: RegistryEntry | null) => {
					if (registryEntry == null) {
						return null;
					}
					return new HypernetProfileToken(
						accountAddress,
						registryEntry.label,
						config.chainId,
						registryEntry.tokenURI || "",
						registryEntry.tokenId,
					);
				});
		});
	}

	public getProfileTokenByUsername(
		username: UsernameString,
	): ResultAsync<
		HypernetProfileToken | null,
		| BlockchainUnavailableError
		| EthereumReadError
		| NonFungibleRegistryContractError
	> {
		return ResultUtils.combine([
			this.blockchainProvider.getProvider(),
			this.configProvider.getConfig(),
		]).andThen(([provider, config]) => {
			const profileContract =
				new NonFungibleRegistryEnumerableUpgradeableContract(
					provider,
					config.profileRegistryAddress,
				);

			return profileContract
				.getRegistryEntryByLabel(
					username,
					true,
					config.profileRegistryAddress,
				)
				.map((registryEntry: RegistryEntry | null) => {
					if (registryEntry == null) {
						return null;
					}
					const profileToken = new HypernetProfileToken(
						registryEntry.owner,
						registryEntry.label,
						config.chainId,
						registryEntry.tokenURI || "",
						registryEntry.tokenId,
					);

					return profileToken;
				})
				.orElse(() => {
					// getRegistryEntryByLabel returns an error if the entry is not found, we assume this means there is no entry,
					// and not an actual error.
					return okAsync(null);
				});
		});
	}
}
