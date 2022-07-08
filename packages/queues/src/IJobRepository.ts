import {
	BatchMintJob,
	MintHypernetProfileTokenJob,
	MintIdentityTokenJob,
	ProcessBlockJob,
	QueueError,
	ProcessZipFileJob,
	UploadFileJob,
	DeleteFileJob,
	MintRegistryTokenJob,
} from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

export interface IJobRepository {
	sendBatchMintJob(job: BatchMintJob): ResultAsync<void, QueueError>;
	sendDeleteFileJob(job: DeleteFileJob): ResultAsync<void, QueueError>;
	sendMintHypernetProfileTokenJob(
		job: MintHypernetProfileTokenJob,
	): ResultAsync<void, QueueError>;
	sendMintIdentityTokenJob(
		job: MintIdentityTokenJob,
	): ResultAsync<void, QueueError>;
	sendMintRegistryTokenJob(
		job: MintRegistryTokenJob,
	): ResultAsync<void, QueueError>;
	sendProcessBlockJob(job: ProcessBlockJob): ResultAsync<void, QueueError>;
	sendProcessZipFileJob(
		job: ProcessZipFileJob,
	): ResultAsync<void, QueueError>;
	sendUploadFileJob(job: UploadFileJob): ResultAsync<void, QueueError>;
}

export const IJobRepositoryType = Symbol.for("IJobRepository");
