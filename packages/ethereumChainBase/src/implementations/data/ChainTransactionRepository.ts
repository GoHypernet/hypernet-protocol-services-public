import {
	BlockNumber,
	DatabaseError,
	EscrowWalletId,
	ETransactionStatus,
	TransactionHash,
} from "@hypernetlabs/hypernet.id-objects";
import {
	UnixTimestamp,
	UUID,
	ChainId,
	EthereumContractAddress,
	BigNumberString,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IChainTransactionRepository } from "@ethereumChainBase/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ethereumChainBase/interfaces/data/utilities";
import { ChainTransactionEntity } from "@ethereumChainBase/prisma/client";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import {
	ChainTransaction,
	NewChainTransaction,
} from "@hypernetlabs/hypernet.id-chain-contracts";

@injectable()
export class ChainTransactionRepository implements IChainTransactionRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public add(
		newChainTransactions: NewChainTransaction[],
	): ResultAsync<ChainTransaction[], DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultUtils.combine(
				newChainTransactions.map((newChainTransaction) => {
					return ResultAsync.fromPromise(
						prisma.chainTransactionEntity.create({
							data: {
								id: uuidBuffer.toBuffer(v4()),
								chain_id: newChainTransaction.chainId,
								transaction_hash:
									newChainTransaction.transactionHash,
								registry_address:
									newChainTransaction.registryAddress,
								max_fee_per_gas:
									newChainTransaction.maxFeePerGas,
								max_priority_fee_per_gas:
									newChainTransaction.maxPriorityFeePerGas,
								gas_limit: newChainTransaction.gasLimit,
								block_number: newChainTransaction.blockNumber,
								value: newChainTransaction.value,
								nonce: newChainTransaction.nonce,
								status: newChainTransaction.status,
								escrow_wallet_id: uuidBuffer.toBuffer(
									newChainTransaction.escrowWalletId,
								),
							},
						}),
						(e) => {
							return new DatabaseError((e as Error).message, e);
						},
					).map((entity) => {
						return this.entityToObject(entity);
					});
				}),
			);
		});
	}

	public getById(
		chainTransactionId: UUID,
	): ResultAsync<ChainTransaction | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTransactionEntity.findFirst({
						where: {
							id: uuidBuffer.toBuffer(chainTransactionId),
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

	public getAll(): ResultAsync<ChainTransaction[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTransactionEntity.findMany({
						where: {
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

	public getSubmittedTransactions(): ResultAsync<
		ChainTransaction[],
		DatabaseError
	> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTransactionEntity.findMany({
						where: {
							deleted: false,
							status: ETransactionStatus.Submitted,
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

	public getByTransactionHash(
		transactionHash: TransactionHash,
	): ResultAsync<ChainTransaction | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTransactionEntity.findFirst({
						where: {
							transaction_hash: transactionHash,
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

	public update(
		chainTransaction: ChainTransaction,
	): ResultAsync<ChainTransaction, DatabaseError> {
		const now = new Date();

		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.chainTransactionEntity.update({
					where: { id: uuidBuffer.toBuffer(chainTransaction.id) },
					data: {
						max_fee_per_gas: chainTransaction.maxFeePerGas,
						max_priority_fee_per_gas:
							chainTransaction.maxPriorityFeePerGas,
						gas_limit: chainTransaction.gasLimit,
						block_number: chainTransaction.blockNumber,
						value: chainTransaction.value,
						nonce: chainTransaction.nonce,
						status: chainTransaction.status,
						updated_timestamp: now,
					},
				}),
				(e) => {
					return new DatabaseError((e as Error).message, e);
				},
			).map((entity) => {
				return this.entityToObject(entity);
			});
		});
	}

	protected entityToObject(entity: ChainTransactionEntity): ChainTransaction {
		return new ChainTransaction(
			UUID(uuidBuffer.toString(entity.id)),
			ChainId(entity.chain_id),
			TransactionHash(entity.transaction_hash),
			EthereumContractAddress(entity.registry_address),
			entity.max_fee_per_gas != null
				? BigNumberString(entity.max_fee_per_gas)
				: null,
			entity.max_priority_fee_per_gas != null
				? BigNumberString(entity.max_priority_fee_per_gas)
				: null,
			BigNumberString(entity.gas_limit),
			entity.block_number != null
				? BlockNumber(entity.block_number)
				: null,
			BigNumberString(entity.value),
			entity.nonce,
			entity.status,
			EscrowWalletId(uuidBuffer.toString(entity.escrow_wallet_id)),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
		);
	}
}
