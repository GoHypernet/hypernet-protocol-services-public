import {
	IRedisProvider,
	IRedisProviderType,
} from "@hypernetlabs/common-redis-provider";
import { QueueError, BaseJob } from "@hypernetlabs/hypernet.id-objects";
import Queue from "bee-queue";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, ResultAsync } from "neverthrow";

import { JobOptions, ScheduledJobOptions } from "@queues/JobOptions";

@injectable()
export class BaseJobRepository {
	protected queues: Map<string, ResultAsync<Queue<BaseJob>, never>>;
	constructor(
		@inject(IRedisProviderType) protected redisProvider: IRedisProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {
		this.queues = new Map();
	}
	protected sendJob<JobType extends BaseJob, ResultType>(
		job: JobType,
		options: JobOptions | ScheduledJobOptions = new JobOptions(),
	): ResultAsync<ResultType, QueueError> {
		return this.getQueue(job).andThen((queue) => {
			try {
				// Create the job and set some parameters
				const queuedJob = queue
					.createJob(job)
					.retries(options.retries)
					.backoff(options.backoffType, options.retryDelayMs);

				if (options["delayMs"]) {
					queuedJob.delayUntil(Date.now() + options["delayMs"]);
				}

				// Save the job
				return ResultAsync.fromPromise(queuedJob.save(), (e) => {
					return new QueueError(
						`Cannot queue job ${job.getQueueName()}`,
						e,
					);
				}).andThen((queuedJob) => {
					const jobPromise = new Promise<ResultType>(
						(resolve, reject) => {
							queuedJob.on("succeeded", (result: ResultType) => {
								resolve(result);
							});

							queuedJob.on("failed", (err) => {
								reject(err);
							});

							queuedJob.on("retrying", (err) => {
								this.logger.warn(
									`Job ${queuedJob.id} failed with error ${err.message} but is being retried! Remaining retries: ${queuedJob.retries}`,
									err,
								);
							});
						},
					);
					return ResultAsync.fromPromise(
						jobPromise,
						(e) => e as QueueError,
					);
				});
			} catch (e) {
				return errAsync(new QueueError("Error creating job", e));
			}
		});
	}

	protected getQueue<JobType extends BaseJob>(
		job: JobType,
	): ResultAsync<Queue<BaseJob>, QueueError> {
		const queueName = job.getQueueName();
		let queue = this.queues.get(queueName);
		if (queue == null) {
			this.logger.debug(`Creating queue for job ${queueName}`);
			queue = this.redisProvider.getRedisClient().map((redisClient) => {
				return new Queue(queueName, {
					redis: redisClient.getClient(),
					isWorker: false, // We will not process jobs, only send them
				});
			});
			this.queues.set(queueName, queue);
		}
		return queue;
	}
}
