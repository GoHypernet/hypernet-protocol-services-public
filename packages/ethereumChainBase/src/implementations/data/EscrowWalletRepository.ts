import {
	DatabaseError,
	EscrowWalletId,
	PagingRequest,
} from "@hypernetlabs/hypernet.id-objects";
import {
	UnixTimestamp,
	UUID,
	ChainId,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IEscrowWalletRepository } from "@ethereumChainBase/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ethereumChainBase/interfaces/data/utilities";
import { EscrowWalletEntity } from "@ethereumChainBase/prisma/client";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import {
	EscrowWallet,
	EscrowWalletBalance,
} from "@hypernetlabs/hypernet.id-chain-contracts";
import { NewEscrowWalletWithKeys } from "@ethereumChainBase/interfaces/objects";
import {
	AESEncryptedString,
	InitializationVector,
	EncryptedString,
} from "@hypernetlabs/common-objects";
import { EncryptionResult } from "@hypernetlabs/hypernet.id-security";

@injectable()
export class EscrowWalletRepository implements IEscrowWalletRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public add(
		escrowWallets: NewEscrowWalletWithKeys[],
	): ResultAsync<EscrowWallet[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.$transaction(
						escrowWallets.map((newEscrowWallets) => {
							return prisma.escrowWalletEntity.create({
								data: {
									id: uuidBuffer.toBuffer(v4()),
									account_address:
										newEscrowWallets.accountAddress,
									chain_id: newEscrowWallets.chainId,
									private_key_e: newEscrowWallets.privateKeyE,
									private_key_iv:
										newEscrowWallets.privateKeyIv,
									encryption_key_version:
										newEscrowWallets.encryptionKeyVersion,
									is_default: newEscrowWallets.defaultWallet,
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
		escrowWalletIds: EscrowWalletId[],
	): ResultAsync<EscrowWallet[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletEntity.findMany({
						where: {
							id: {
								in: escrowWalletIds.map((id) =>
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

	public getAll(
		paging: PagingRequest,
	): ResultAsync<EscrowWallet[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletEntity.findMany({
						skip: paging.page * paging.pageSize,
						take: paging.pageSize,
						where: {
							deleted: false,
						},
						orderBy: {
							created_timestamp: "asc",
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

	public getEscrowWalletEncryptedKeyData(
		escrowWalletId?: EscrowWalletId,
	): ResultAsync<EncryptionResult | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletEntity.findFirst({
						where: {
							...(escrowWalletId != null
								? { id: uuidBuffer.toBuffer(escrowWalletId) }
								: { is_default: true }),
						},
					}),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entity) => {
				if (entity == null) {
					return null;
				}

				return new EncryptionResult(
					new AESEncryptedString(
						EncryptedString(entity.private_key_e),
						InitializationVector(entity.private_key_iv),
					),
					entity.encryption_key_version,
				);
			});
	}

	public getDefaultEscrowWallet(): ResultAsync<EscrowWallet, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletEntity.findFirst({
						where: {
							is_default: true,
						},
					}),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entity) => {
				if (entity == null) {
					throw new Error(
						"There should be always one default escrow wallet record",
					);
				}
				return this.entityToObject(entity);
			});
	}

	public getByAccountAddress(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<EscrowWallet | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.escrowWalletEntity.findFirst({
						where: {
							account_address: accountAddress,
						},
					}),
					(e) => {
						return new DatabaseError((e as Error).message, e);
					},
				);
			})
			.map((entity) => {
				if (entity == null) {
					return null;
				}
				return this.entityToObject(entity);
			});
	}

	protected entityToObject(entity: EscrowWalletEntity): EscrowWallet {
		return new EscrowWallet(
			EscrowWalletId(uuidBuffer.toString(entity.id)),
			ChainId(entity.chain_id),
			EthereumAccountAddress(entity.account_address),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
		);
	}
}
