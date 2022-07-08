import {
	DatabaseError,
	EscrowWalletId,
	IdentityId,
} from "@hypernetlabs/hypernet.id-objects";
import {
	UnixTimestamp,
	UUID,
	ChainId,
	EthereumAccountAddress,
	EthereumContractAddress,
	RegistryTokenId,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IChainTokenRepository } from "@ethereumChainBase/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ethereumChainBase/interfaces/data/utilities";
import { ChainTokenEntity } from "@ethereumChainBase/prisma/client";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import {
	ChainToken,
	ChainTokensToMint,
	NewChainToken,
} from "@hypernetlabs/hypernet.id-chain-contracts";

@injectable()
export class ChainTokenRepository implements IChainTokenRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public add(
		newChainTokens: NewChainToken[],
	): ResultAsync<ChainToken[], DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultUtils.combine(
				newChainTokens.map((newChainToken) => {
					return ResultAsync.fromPromise(
						prisma.chainTokenEntity.create({
							data: {
								id: uuidBuffer.toBuffer(v4()),
								chain_id: newChainToken.chainId,
								registry_address: newChainToken.registryAddress,
								token_id: BigInt(newChainToken.tokenId),
								account_address: newChainToken.accountAddress,
								label: newChainToken.label,
								token_uri: newChainToken.tokenUri,
								token_type: newChainToken.tokenType,
								token_identifier: uuidBuffer.toBuffer(
									newChainToken.tokenIdentifier,
								),
								chain_transaction_id:
									newChainToken.chainTransactionId != null
										? uuidBuffer.toBuffer(
												newChainToken.chainTransactionId,
										  )
										: null,
								escrow_wallet_id: uuidBuffer.toBuffer(
									newChainToken.escrowWalletId,
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
		chainTokenId: UUID,
	): ResultAsync<ChainToken | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTokenEntity.findFirst({
						where: {
							id: uuidBuffer.toBuffer(chainTokenId),
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

	public getByChainToken(
		newChainToken: NewChainToken,
	): ResultAsync<ChainToken | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTokenEntity.findFirst({
						where: {
							chain_id: newChainToken.chainId,
							registry_address: newChainToken.registryAddress,
							account_address: newChainToken.accountAddress,
							label: newChainToken.label,
							token_uri: newChainToken.tokenUri,
							token_type: newChainToken.tokenType,
							token_identifier: uuidBuffer.toBuffer(
								newChainToken.tokenIdentifier,
							),
							escrow_wallet_id: uuidBuffer.toBuffer(
								newChainToken.escrowWalletId,
							),
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

	public getAll(): ResultAsync<ChainToken[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTokenEntity.findMany({
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

	public getChainTokensToMint(): ResultAsync<
		ChainTokensToMint[],
		DatabaseError
	> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.chainTokenEntity.groupBy({
					by: ["escrow_wallet_id", "registry_address"],
					where: {
						deleted: false,
						chain_transaction_id: null,
					},
				}),
				(e) => {
					return new DatabaseError((e as Error).message, e);
				},
			).andThen((entities) => {
				return ResultUtils.combine(
					entities.map((entity) => {
						return ResultAsync.fromPromise(
							prisma.chainTokenEntity.findMany({
								where: {
									deleted: false,
									escrow_wallet_id: entity.escrow_wallet_id,
									registry_address: entity.registry_address,
								},
							}),
							(e) => {
								return new DatabaseError(
									(e as Error).message,
									e,
								);
							},
						).andThen((chainTokenEntities) => {
							return okAsync(
								new ChainTokensToMint(
									EscrowWalletId(
										uuidBuffer.toString(
											entity.escrow_wallet_id,
										),
									),
									EthereumContractAddress(
										entity.registry_address,
									),
									chainTokenEntities.map(
										(chainTokenEntity) => {
											return this.entityToObject(
												chainTokenEntity,
											);
										},
									),
								),
							);
						});
					}),
				);
			});
		});
	}

	public getByChainTransactionId(
		transactionId: UUID,
	): ResultAsync<ChainToken[], DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.chainTokenEntity.findMany({
						where: {
							chain_transaction_id:
								uuidBuffer.toBuffer(transactionId),
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

	public update(
		chainToken: ChainToken,
	): ResultAsync<ChainToken, DatabaseError> {
		const now = new Date();

		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.chainTokenEntity.update({
					where: { id: uuidBuffer.toBuffer(chainToken.id) },
					data: {
						chain_transaction_id:
							chainToken.chainTransactionId != null
								? uuidBuffer.toBuffer(
										chainToken.chainTransactionId,
								  )
								: null,
						token_identifier: uuidBuffer.toBuffer(
							chainToken.tokenIdentifier,
						),
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

	protected entityToObject(entity: ChainTokenEntity): ChainToken {
		return new ChainToken(
			UUID(uuidBuffer.toString(entity.id)),
			ChainId(entity.chain_id),
			EthereumContractAddress(entity.registry_address),
			RegistryTokenId(entity.token_id.toString()),
			EthereumAccountAddress(entity.account_address),
			entity.label,
			entity.token_uri,
			entity.token_type,
			UUID(uuidBuffer.toString(entity.token_identifier)),
			entity.chain_transaction_id != null
				? UUID(uuidBuffer.toString(entity.chain_transaction_id))
				: null,
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
