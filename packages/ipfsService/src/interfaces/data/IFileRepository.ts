import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { File, NewFile } from "@hypernetlabs/hypernet.id-ipfs-contracts";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IFileRepository {
	getById(id: UUID): ResultAsync<File | null, DatabaseError>;
	create(file: NewFile): ResultAsync<File, DatabaseError>;
	update(file: File): ResultAsync<File, DatabaseError>;
}

export const IFileRepositoryType = Symbol.for("IFileRepository");
