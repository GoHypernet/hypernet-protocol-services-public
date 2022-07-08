import {
	NewEscrowWalletAsset,
	EscrowWalletAsset,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import {
	DatabaseError,
	EscrowWalletId,
} from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IEscrowWalletAssetRepository {
	add(
		newEscrowWalletAssets: NewEscrowWalletAsset[],
	): ResultAsync<EscrowWalletAsset[], DatabaseError>;
	getByIds(
		escrowWalletAssetIds: UUID[],
	): ResultAsync<EscrowWalletAsset[], DatabaseError>;
	getByEscrowWalletId(
		escrowWalletId: EscrowWalletId,
	): ResultAsync<EscrowWalletAsset[], DatabaseError>;
}

export const IEscrowWalletAssetRepositoryType = Symbol.for(
	"IEscrowWalletAssetRepository",
);
