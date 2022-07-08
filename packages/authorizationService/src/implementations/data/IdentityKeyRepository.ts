import { IIdentityKeyRepository } from "@authorization/interfaces/data";
import { IdentityKey, NewIdentityKey } from "@authorization/interfaces/objects";
import {
	AESEncryptedString,
	EncryptedString,
	InitializationVector,
} from "@hypernetlabs/common-objects";
import { DatabaseError, IdentityId } from "@hypernetlabs/hypernet.id-objects";
import { UnixTimestamp, UUID } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import * as uuidBuffer from "uuid-buffer";

import { IdentityKeyEntity } from "@authenticationContracts/prisma/client";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@authorization/interfaces/data/utilities";

@injectable()
export class IdentityKeyRepository implements IIdentityKeyRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
	) {}
	public getByIdentityId(
		identityId: IdentityId,
	): ResultAsync<IdentityKey | null, DatabaseError> {
		return this.prismaProvider
			.getPrismaClient()
			.andThen((prisma) => {
				return ResultAsync.fromPromise(
					prisma.identityKeyEntity.findFirst({
						where: {
							identity_id: uuidBuffer.toBuffer(identityId),
							deleted: false,
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

	public create(
		newIdentityKey: NewIdentityKey,
	): ResultAsync<IdentityKey, DatabaseError> {
		return errAsync(new DatabaseError("not implemented", null));
	}

	public entityToObject(entity: IdentityKeyEntity): IdentityKey {
		return new IdentityKey(
			UUID(uuidBuffer.toString(entity.id)),
			IdentityId(uuidBuffer.toString(entity.identity_id)),
			new AESEncryptedString(
				EncryptedString(entity.encryption_key_e),
				InitializationVector(entity.encryption_key_iv),
			),
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
			entity.deleted,
		);
	}
}
