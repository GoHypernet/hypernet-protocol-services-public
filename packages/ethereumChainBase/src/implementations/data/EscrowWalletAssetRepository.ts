import {
	EscrowWalletId,
	BlockNumber,
	DatabaseError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	UnixTimestamp,
	UUID,
	BigNumberString,
	EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IEscrowWalletAssetRepository } from "@ethereumChainBase/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ethereumChainBase/interfaces/data/utilities";
import { EscrowWalletAssetEntity } from "@ethereumChainBase/prisma/client";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import {
	EscrowWalletAsset,
	NewEscrowWalletAsset,
} from "@hypernetlabs/hypernet.id-chain-contracts";

@injectable()
export class EscrowWalletAssetRepository
	implements IEscrowWalletAssetRepository
{
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public add(
		newEscrowWalletAssets: NewEscrowWalletAsset[],
	): ResultAsync<EscrowWalletAsset[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.$transaction(
						newEscrowWalletAssets.map((newEscrowWalletAsset) => {
							return prisma.escrowWalletAssetEntity.create({
								data: {
									id: uuidBuffer.toBuffer(v4()),
									escrow_wallet_id: uuidBuffer.toBuffer(
										newEscrowWalletAsset.escrowWalletId,
									),
									asset_address:
										newEscrowWalletAsset.assetAddress,
									last_balance:
										newEscrowWalletAsset.lastBalance,
									block_number:
										newEscrowWalletAsset.blockNumber,
								},
							});
						}),
					),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entities) => {
				return entities.map((entity) => {
					return this.entityToObject(entity);
				});
			});
	}

	public getByIds(
		escrowWalletAssetIds: UUID[],
	): ResultAsync<EscrowWalletAsset[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletAssetEntity.findMany({
						where: {
							id: {
								in: escrowWalletAssetIds.map((id) =>
									uuidBuffer.toBuffer(id),
								),
							},
							deleted: false,
						},
					}),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entities) => {
				return entities.map((entity) => {
					return this.entityToObject(entity);
				});
			});
	}

	public getByEscrowWalletId(
		escrowWalletId: EscrowWalletId,
	): ResultAsync<EscrowWalletAsset[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletAssetEntity.findMany({
						where: {
							escrow_wallet_id:
								uuidBuffer.toBuffer(escrowWalletId),
							deleted: false,
						},
					}),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entities) => {
				return entities.map((entity) => {
					return this.entityToObject(entity);
				});
			});
	}

	protected entityToObject(
		entity: EscrowWalletAssetEntity,
	): EscrowWalletAsset {
		return new EscrowWalletAsset(
			UUID(uuidBuffer.toString(entity.id)),
			EscrowWalletId(uuidBuffer.toString(entity.escrow_wallet_id)),
			EthereumContractAddress(entity.asset_address),
			BigNumberString(entity.last_balance),
			BlockNumber(entity.block_number),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
		);
	}
}
