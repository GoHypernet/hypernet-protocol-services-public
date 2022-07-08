import {
	DatabaseError,
	IPFSContentIdentifier,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EFileStatus,
	File,
	NewFile,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import { UnixTimestamp, UUID } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";

import { IFileRepository } from "@ipfs/interfaces/data";
import {
	IPrismaProvider,
	IPrismaProviderType,
} from "@ipfs/interfaces/data/utilities";
import { FileEntity } from "@ipfs/prisma/client";

@injectable()
export class FileRepository implements IFileRepository {
	public constructor(
		@inject(IPrismaProviderType) protected prismaProvider: IPrismaProvider,
	) {}

	public getById(fileId: UUID): ResultAsync<File | null, DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.fileEntity.findFirst({
					where: {
						id: uuidBuffer.toBuffer(fileId),
					},
					include: {
						upload_location: true,
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

	public create(file: NewFile): ResultAsync<File, DatabaseError> {
		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.fileEntity.create({
					data: {
						id: uuidBuffer.toBuffer(v4()),
						file_name: file.filename,
						cid: file.cid,
						pinned: file.cid != null,
						upload_location_id: uuidBuffer.toBuffer(
							file.uploadLocationId,
						),
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

	public update(file: File): ResultAsync<File, DatabaseError> {
		const now = new Date();

		return this.prismaProvider.getPrismaClient().andThen((prisma) => {
			return ResultAsync.fromPromise(
				prisma.fileEntity.update({
					where: { id: uuidBuffer.toBuffer(file.id) },
					data: {
						file_name: file.filename,
						cid: file.cid,
						pinned: file.cid != null,
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

	public entityToObject(entity: FileEntity): File {
		return new File(
			UUID(uuidBuffer.toString(entity.id)),
			entity.file_name,
			UUID(uuidBuffer.toString(entity.upload_location_id)),
			// TODO: add filestatus to entity
			EFileStatus.Uploaded,
			IPFSContentIdentifier(entity.cid || ""),
			UnixTimestamp(
				Math.floor(entity.updated_timestamp.getTime() / 1000),
			),
			UnixTimestamp(
				Math.floor(entity.created_timestamp.getTime() / 1000),
			),
		);
	}
}
