import {
	UploadLocation,
	NewUploadLocation,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IUploadLocationRepository {
	getById(id: UUID): ResultAsync<UploadLocation | null, DatabaseError>;
	create(
		uploadLocation: NewUploadLocation,
	): ResultAsync<UploadLocation, DatabaseError>;
	update(
		uploadLocation: UploadLocation,
	): ResultAsync<UploadLocation, DatabaseError>;
}

export const IUploadLocationRepositoryType = Symbol.for(
	"IUploadLocationRepository",
);
