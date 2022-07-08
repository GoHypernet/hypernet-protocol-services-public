import {
	BucketUnavailableError,
	EUploadLocationAccess,
	UrlString,
} from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { PubSub, Subscription } from "@google-cloud/pubsub";
import { Storage } from "@google-cloud/storage";

import { IConfigProvider, IConfigProviderType } from "@ipfs/interfaces/utils";
import { IBucketRepository } from "@ipfs/interfaces/data";
import { DOWNLOADS_FOLDER_PATH } from "@ipfs/constants";

@injectable()
export class GoogleBucketRepository implements IBucketRepository {
	protected initializationPromise: ResultAsync<
		void,
		BucketUnavailableError
	> | null = null;
	protected storageClient: Storage | null = null;
	protected pubSubClient: PubSub | null = null;

	protected subscriptions: Subscription[] = [];

	public constructor(
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {
		this.storageClient = null;
		this.pubSubClient = null;
		this.initializationPromise = null;
	}

	public initialize(): ResultAsync<void, BucketUnavailableError> {
		if (this.initializationPromise == null) {
			this.initializationPromise = this.configProvider
				.getConfig()
				.andThen((config) => {
					try {
						const clientConfig = {
							projectId: config.googleBucketConfig.projectId,
							keyFilename: config.googleBucketConfig.keyFilename,
						};
						this.storageClient = new Storage(clientConfig);
						this.pubSubClient = new PubSub(clientConfig);

						this.subscriptions =
							config.googleBucketConfig.subscriptionIds.map(
								(subscriptionId) => {
									return (
										this.pubSubClient as PubSub
									).subscription(subscriptionId);
								},
							);
					} catch (e) {
						return errAsync(
							new BucketUnavailableError(
								"Failure during Google Bucket initialization",
								e,
							),
						);
					}
					return okAsync(undefined);
				});
		}

		return this.initializationPromise;
	}

	public getStorageClient(): ResultAsync<Storage, BucketUnavailableError> {
		return this.initialize().map(() => {
			if (this.storageClient == null) {
				throw new BucketUnavailableError(
					"Storage Client is not available",
				);
			}

			return this.storageClient;
		});
	}

	public getPubSubClient(): ResultAsync<PubSub, BucketUnavailableError> {
		return this.initialize().map(() => {
			if (this.pubSubClient == null) {
				throw new BucketUnavailableError(
					"PubSub Client is not available",
				);
			}

			return this.pubSubClient;
		});
	}

	public getSubscriptions(): ResultAsync<
		Subscription[],
		BucketUnavailableError
	> {
		return this.initialize().map(() => {
			if (this.subscriptions.length < 1) {
				throw new BucketUnavailableError(
					"Subscriptions are not available",
				);
			}

			return this.subscriptions;
		});
	}

	public getUploadUrl(
		filename: string,
		uploadLocationAccess: EUploadLocationAccess,
	): ResultAsync<UrlString, BucketUnavailableError> {
		return this.getBucketNameByAccess(uploadLocationAccess).andThen(
			(bucketName) => {
				if (this.storageClient == null) {
					return errAsync(
						new BucketUnavailableError(
							"Must call GoogleBucketRepository.initialize() first before you can call getUploadUrl()",
						),
					);
				}

				return ResultAsync.fromPromise(
					this.storageClient
						.bucket(bucketName)
						.file(filename)
						.getSignedUrl({
							action: "write",
							version: "v4",
							expires: Date.now() + 15 * 60 * 1000, // 15 minutes
							contentType: "application/octet-stream",
						}),
					(e) => {
						this.logger.error(e);
						return new BucketUnavailableError(
							"Function call getUploadUrl() failed",
						);
					},
				).map(([url]) => {
					return UrlString(url);
				});
			},
		);
	}

	public downloadFile(
		filename: string,
		bucketName: string,
	): ResultAsync<void, BucketUnavailableError> {
		if (this.storageClient == null) {
			return errAsync(
				new BucketUnavailableError(
					"Must call GoogleBucketRepository.initialize() first before you can call downloadFile()",
				),
			);
		}

		return ResultAsync.fromPromise(
			this.storageClient
				.bucket(bucketName)
				.file(filename)
				.download({
					destination: `${DOWNLOADS_FOLDER_PATH}/${filename}`,
				}),
			(e) => {
				this.logger.error(e);
				return new BucketUnavailableError(
					"Function call downloadFile() failed",
				);
			},
		).andThen(() => {
			return okAsync(undefined);
		});
	}

	public downloadFileIntoMemory(
		filename: string,
		bucketName: string,
	): ResultAsync<Uint8Array, BucketUnavailableError> {
		if (this.storageClient == null) {
			return errAsync(
				new BucketUnavailableError(
					"Must call GoogleBucketRepository.initialize() first before you can call downloadFileIntoMemory()",
				),
			);
		}

		return ResultAsync.fromPromise(
			this.storageClient.bucket(bucketName).file(filename).download(),
			(e) => {
				this.logger.error(e);
				return new BucketUnavailableError(
					"Function call downloadFileIntoMemory() failed",
				);
			},
		).map((contents) => {
			return new Uint8Array(contents[0]);
		});
	}

	public uploadFile(
		filePath: string,
		content: Buffer,
		bucketName: string,
	): ResultAsync<void, BucketUnavailableError> {
		if (this.storageClient == null) {
			return errAsync(
				new BucketUnavailableError(
					"Must call GoogleBucketRepository.initialize() first before you can call uploadFile()",
				),
			);
		}

		return ResultAsync.fromPromise(
			this.storageClient.bucket(bucketName).file(filePath).save(content),
			(e) => {
				this.logger.error(e);
				return new BucketUnavailableError(
					"Function call uploadFile() failed",
				);
			},
		);
	}

	public getBucketNameByAccess(
		uploadLocationAccess: EUploadLocationAccess,
	): ResultAsync<string, never> {
		return this.configProvider.getConfig().andThen((config) => {
			const bucketName = uploadLocationAccess
				? config.googleBucketConfig.publicBucketName
				: config.googleBucketConfig.privateBucketName;

			return okAsync(bucketName);
		});
	}
}
