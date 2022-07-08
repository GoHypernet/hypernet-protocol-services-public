import { EscrowWallet } from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	DatabaseError,
	EscrowWalletId,
	PagingRequest,
} from "@hypernetlabs/hypernet.id-objects";
import { NewEscrowWalletWithKeys } from "@ethereumChainBase/interfaces/objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { AESEncryptedString } from "@hypernetlabs/common-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";

export interface IEscrowWalletRepository {
	add(
		escrowWallets: NewEscrowWalletWithKeys[],
	): ResultAsync<EscrowWallet[], DatabaseError>;
	getByIds(
		escrowWalletIds: EscrowWalletId[],
	): ResultAsync<EscrowWallet[], DatabaseError>;
	getByAccountAddress(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<EscrowWallet | null, DatabaseError>;
	getAll(paging: PagingRequest): ResultAsync<EscrowWallet[], DatabaseError>;
	getEscrowWalletEncryptedKeyData(
		escrowWalletId?: EscrowWalletId,
	): ResultAsync<EncryptionResult | null, DatabaseError>;
	getDefaultEscrowWallet(): ResultAsync<EscrowWallet, DatabaseError>;
}

export const IEscrowWalletRepositoryType = Symbol.for(
	"IEscrowWalletRepository",
);
