import {
	BucketUnavailableError,
	EUploadLocationAccess,
	UrlString,
} from "@hypernetlabs/hypernet.id-objects";
import { PubSub, Subscription } from "@google-cloud/pubsub";
import { Storage } from "@google-cloud/storage";
import { ResultAsync } from "neverthrow";

export interface IBucketRepository {
	initialize(): ResultAsync<void, BucketUnavailableError>;
	getStorageClient(): ResultAsync<Storage, BucketUnavailableError>;
	getPubSubClient(): ResultAsync<PubSub, BucketUnavailableError>;
	getSubscriptions(): ResultAsync<Subscription[], BucketUnavailableError>;
	getUploadUrl(
		filename: string,
		uploadLocationAccess: EUploadLocationAccess,
	): ResultAsync<UrlString, BucketUnavailableError>;
	getBucketNameByAccess(
		uploadLocationAccess: EUploadLocationAccess,
	): ResultAsync<string, never>;
	downloadFile(
		filename: string,
		bucketName: string,
	): ResultAsync<void, BucketUnavailableError>;
	downloadFileIntoMemory(
		filename: string,
		bucketName: string,
	): ResultAsync<Uint8Array, BucketUnavailableError>;
	uploadFile(
		filePath: string,
		content: Buffer,
		bucketName: string,
	): ResultAsync<void, BucketUnavailableError>;
}

export const IBucketRepositoryType = Symbol.for("IBucketRepository");
