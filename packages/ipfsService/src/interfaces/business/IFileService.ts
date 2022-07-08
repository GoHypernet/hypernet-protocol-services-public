import {
	File,
	IPFSImportCandidate,
	UploadLocation,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import {
	BucketUnavailableError,
	DatabaseError,
	EUploadLocationAccess,
	EUploadLocationFilePinning,
	FileSystemError,
	IPFSUnavailableError,
	QueueError,
	ResolvedUserContext,
	UnauthorizedError,
	UnknownEntityError,
	UrlString,
} from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IFileService {
	createUploadLocation(
		userContext: ResolvedUserContext,
		locationIdentifier: string,
		filePinning: EUploadLocationFilePinning,
		access: EUploadLocationAccess,
	): ResultAsync<UploadLocation, DatabaseError | IPFSUnavailableError>;
	getUploadLink(
		uploadLocationId: UUID,
		filename: string,
	): ResultAsync<
		UrlString,
		DatabaseError | BucketUnavailableError | UnknownEntityError
	>;
	initialize(): ResultAsync<
		void,
		IPFSUnavailableError | BucketUnavailableError
	>;
	onFileUploaded(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<
		void,
		| DatabaseError
		| BucketUnavailableError
		| UnknownEntityError
		| IPFSUnavailableError
	>;
	onZipFileUploaded(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<void, FileSystemError | DatabaseError | QueueError>;
	processDeleteFileJob(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<void, BucketUnavailableError | FileSystemError>;
	processUploadFileJob(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<
		void,
		| DatabaseError
		| BucketUnavailableError
		| UnknownEntityError
		| FileSystemError
		| QueueError
	>;
	processZipFile(
		userContext: ResolvedUserContext,
		fileId: UUID,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<
		void,
		| DatabaseError
		| BucketUnavailableError
		| UnknownEntityError
		| FileSystemError
		| QueueError
	>;
	pinFile(
		uploadLocationId: UUID,
		file: IPFSImportCandidate,
	): ResultAsync<
		File,
		DatabaseError | IPFSUnavailableError | UnknownEntityError
	>;
}

export const IFileServiceType = Symbol.for("IFileService");
