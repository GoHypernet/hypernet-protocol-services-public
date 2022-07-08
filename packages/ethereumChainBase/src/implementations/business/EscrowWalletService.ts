import { IEscrowWalletService } from "@ethereumChainBase/interfaces/business";
import {
	IEscrowWalletRepository,
	IEscrowWalletRepositoryType,
	IEthereumRepository,
	IEthereumRepositoryType,
} from "@ethereumChainBase/interfaces/data";
import { NewEscrowWalletWithKeys } from "@ethereumChainBase/interfaces/objects";
import {
	IConfigProviderType,
	IConfigProvider,
} from "@ethereumChainBase/interfaces/utils";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import { EthereumPrivateKey } from "@hypernetlabs/common-objects";
import { EscrowWallet } from "@hypernetlabs/hypernet.id-chain-contracts";
import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { ChainId } from "@hypernetlabs/objects";
import {
	IEncryptionUtils,
	IEncryptionUtilsType,
} from "@hypernetlabs/hypernet.id-security";
import { ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";

@injectable()
export class EscrowWalletService implements IEscrowWalletService {
	public constructor(
		@inject(IEscrowWalletRepositoryType)
		protected escrowWalletRepository: IEscrowWalletRepository,
		@inject(IEthereumRepositoryType)
		protected ethereumRepository: IEthereumRepository,
		@inject(IEncryptionUtilsType)
		protected encryptionUtils: IEncryptionUtils,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public establishEscrowWallet(
		chainId: ChainId,
		walletPrivateKey?: EthereumPrivateKey | null,
	): ResultAsync<EscrowWallet, DatabaseError> {
		let walletPrivateKeyResult: ResultAsync<EthereumPrivateKey, never>;
		if (walletPrivateKey == null) {
			walletPrivateKeyResult =
				this.cryptoUtils.createEthereumPrivateKey();
		} else {
			walletPrivateKeyResult = okAsync<EthereumPrivateKey, never>(
				walletPrivateKey,
			);
		}
		return walletPrivateKeyResult
			.andThen((privateKey) => {
				return this.encryptionUtils
					.encryptSecret(privateKey)
					.andThen((AESEncryptedPrivateKey) => {
						const accountAddress =
							this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
								privateKey,
							);

						const newEscrowWalletWithKeys =
							new NewEscrowWalletWithKeys(
								chainId,
								accountAddress,
								AESEncryptedPrivateKey.encryptedString.data,
								AESEncryptedPrivateKey.encryptedString.initializationVector,
								AESEncryptedPrivateKey.encyrptionKeyVersion,
								walletPrivateKey != null ? true : false,
							);

						return this.escrowWalletRepository.add([
							newEscrowWalletWithKeys,
						]);
					});
			})
			.map((escrowWallets) => {
				return escrowWallets[0];
			});
	}
}
