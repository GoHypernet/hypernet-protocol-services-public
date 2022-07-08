import {
	UploadLocation,
	NewUploadLocation,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import {
	DatabaseError,
	EUploadLocationAccess,
	EUploadLocationFilePinning,
} from "@hypernetlabs/hypernet.id-objects";
import { UnixTimestamp, UUID } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";

import { IUploadLocationRepository } from "@ipfs/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ipfs/interfaces/data/utilities";
import { UploadLocationEntity } from "@ipfs/prisma/client";

@injectable()
export class UploadLocationRepository implements IUploadLocationRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
	) {}

	public getById(
		uploadLocationId: UUID,
	): ResultAsync<UploadLocation | null, DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.uploadLocationEntity.findFirst({
					where: {
						id: uuidBuffer.toBuffer(uploadLocationId),
					},
				}),
				(e) => {
					return new DatabaseError((e as Error).message, e);
				},
			).map((entity) => {
				if (entity == null) {
					return null;
				}
				return this.entityToObject(entity);
			});
		});
	}

	public create(
		uploadLocation: NewUploadLocation,
	): ResultAsync<UploadLocation, DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.uploadLocationEntity.create({
					data: {
						id: uuidBuffer.toBuffer(v4()),
						location_identifier: uploadLocation.locationIdentifier,
						google_bucket_name: uploadLocation.googleBucketName,
						pin: !!uploadLocation.filePinning,
						public: !!uploadLocation.access,
						deleted: false,
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

	public update(
		fileLocation: UploadLocation,
	): ResultAsync<UploadLocation, DatabaseError> {
		const now = new Date();

		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.uploadLocationEntity.update({
					where: { id: uuidBuffer.toBuffer(fileLocation.id) },
					data: {
						google_bucket_name: fileLocation.googleBucketName,
						location_identifier: fileLocation.locationIdentifier,
						pin: !!fileLocation.filePinning,
						public: !!fileLocation.access,
						deleted: fileLocation.deleted,
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

	public entityToObject(entity: UploadLocationEntity): UploadLocation {
		return new UploadLocation(
			UUID(uuidBuffer.toString(entity.id)),
			entity.location_identifier,
			entity.google_bucket_name,
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
			entity.pin
				? EUploadLocationFilePinning.ACTIVE
				: EUploadLocationFilePinning.DISABLED,
			entity.public
				? EUploadLocationAccess.PUBLIC
				: EUploadLocationAccess.PRIVATE,
			entity.deleted,
		);
	}
}
