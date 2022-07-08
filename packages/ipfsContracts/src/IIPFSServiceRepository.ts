import {
	BucketUnavailableError,
	DatabaseError,
	InvalidSignatureError,
	IPFSContentIdentifier,
	IPFSUnavailableError,
	RedisError,
	UnauthorizedError,
	UnknownEntityError,
	UrlString,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import {
	CreateUploadLocation,
	GetUploadLink,
	PinFile,
} from "@ipfsContracts/actions";
import { ResultAsync } from "neverthrow";

import { File, UploadLocation } from "@ipfsContracts/objects";

export interface IIPFSServiceRepository {
	createUploadLocation(
		userContext: UserContext,
		request: CreateUploadLocation,
	): ResultAsync<
		UploadLocation,
		| DatabaseError
		| IPFSUnavailableError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
	>;
	getUploadLink(
		userContext: UserContext,
		request: GetUploadLink,
	): ResultAsync<
		UrlString,
		| DatabaseError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
		| BucketUnavailableError
		| UnknownEntityError
	>;
	pinFile(
		userContext: UserContext,
		request: PinFile,
	): ResultAsync<
		File,
		| BucketUnavailableError
		| RedisError
		| UnauthorizedError
		| InvalidSignatureError
	>;
}

export const IIPFSServiceRepositoryType = Symbol.for("IIPFSServiceRepository");
