import {
	QueueError,
	BatchMintJob,
	MintHypernetProfileTokenJob,
	MintIdentityTokenJob,
	ProcessBlockJob,
	ProcessZipFileJob,
	UploadFileJob,
	DeleteFileJob,
	MintRegistryTokenJob,
} from "@hypernetlabs/hypernet.id-objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseJobRepository } from "@queues/BaseJobRepository";
import { IJobRepository } from "@queues/IJobRepository";

@injectable()
export class JobRepository extends BaseJobRepository implements IJobRepository {
	public sendBatchMintJob(job: BatchMintJob): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendDeleteFileJob(
		job: DeleteFileJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendMintHypernetProfileTokenJob(
		job: MintHypernetProfileTokenJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendMintIdentityTokenJob(
		job: MintIdentityTokenJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendMintRegistryTokenJob(
		job: MintRegistryTokenJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendProcessBlockJob(
		job: ProcessBlockJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendProcessZipFileJob(
		job: ProcessZipFileJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}

	public sendUploadFileJob(
		job: UploadFileJob,
	): ResultAsync<void, QueueError> {
		return this.sendJob(job);
	}
}
