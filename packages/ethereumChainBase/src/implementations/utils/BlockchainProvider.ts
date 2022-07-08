import {
	IBlockchainProvider,
	IConfigProvider,
	IConfigProviderType,
} from "@ethereumChainBase/interfaces/utils";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	BlockchainUnavailableError,
	EncryptedString,
	EncryptionKeyUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EncryptionResult,
	IEncryptionUtils,
	IEncryptionUtilsType,
} from "@hypernetlabs/hypernet.id-security";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class BlockchainProvider implements IBlockchainProvider {
	protected provider: ethers.providers.JsonRpcProvider | null;
	protected providerInitializationPromise: ResultAsync<
		void,
		BlockchainUnavailableError
	> | null;
	protected walletSignerMap: Map<EncryptedString, ethers.Wallet>;

	public constructor(
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(IEncryptionUtilsType)
		protected encryptionUtils: IEncryptionUtils,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {
		this.provider = null;
		this.providerInitializationPromise = null;
		this.walletSignerMap = new Map();
	}

	protected initializeProvider(): ResultAsync<
		void,
		BlockchainUnavailableError
	> {
		if (this.providerInitializationPromise == null) {
			this.providerInitializationPromise = this.configProvider
				.getConfig()
				.andThen((config) => {
					this.logger.info(
						`Blockchain provider URL for chain ${config.chainId}: ${config.blockchainRPCProviderUrl}`,
					);
					this.provider = new ethers.providers.JsonRpcProvider(
						config.blockchainRPCProviderUrl,
					);

					return okAsync(undefined);
				});
		}

		return this.providerInitializationPromise;
	}

	/**
	 * getProvider
	 * @return ethers.providers.Web3Provider
	 */
	public getProvider(): ResultAsync<
		ethers.providers.JsonRpcProvider,
		BlockchainUnavailableError
	> {
		return this.initializeProvider().map(() => {
			if (this.provider == null) {
				throw new BlockchainUnavailableError(
					"No provider available!",
					null,
				);
			}

			return this.provider;
		});
	}

	public getSigner(
		encryptedEscrowWalletKeyData: EncryptionResult,
	): ResultAsync<
		ethers.Wallet,
		BlockchainUnavailableError | EncryptionKeyUnavailableError
	> {
		const walletSigner = this.walletSignerMap.get(
			encryptedEscrowWalletKeyData.encryptedString.data,
		);

		if (walletSigner != null) {
			return okAsync(walletSigner);
		}
		return ResultUtils.combine([
			this.configProvider.getConfig(),
			this.getProvider(),
		]).andThen(([config, provider]) => {
			return this.encryptionUtils
				.decryptSecret(
					encryptedEscrowWalletKeyData.encryptedString,
					encryptedEscrowWalletKeyData.encyrptionKeyVersion,
				)
				.andThen((decryptedPrivateKey) => {
					const signer = new ethers.Wallet(
						decryptedPrivateKey,
						provider,
					);

					this.logger.info(
						`Blockchain account address for chain ${config.chainId}: ${signer.address}`,
					);

					return ResultAsync.fromPromise(signer.getBalance(), (e) => {
						return new BlockchainUnavailableError(
							`Cannot get current balance for chain ${config.chainId}`,
							e,
						);
					}).map((balance) => {
						this.logger.info(
							`Current balance for chain ${
								config.chainId
							}: ${balance.toString()}`,
						);

						this.walletSignerMap.set(
							encryptedEscrowWalletKeyData.encryptedString.data,
							signer,
						);
						return signer;
					});
				});
		});
	}
}
