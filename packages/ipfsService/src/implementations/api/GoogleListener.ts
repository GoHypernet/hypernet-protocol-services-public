import { Message, Subscription } from "@google-cloud/pubsub";
import {
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	BucketUnavailableError,
	FileUploadedEvent,
	IPFSUnavailableError,
	ZipFileUploadedEvent,
} from "@hypernetlabs/hypernet.id-objects";
import {
	IJobRepository,
	IJobRepositoryType,
} from "@hypernetlabs/hypernet.id-queues";
import { ResultUtils } from "@hypernetlabs/utils";
import { IGoogleListener } from "@ipfs/interfaces/api";
import {
	IBucketRepository,
	IBucketRepositoryType,
	IUploadLocationRepository,
	IUploadLocationRepositoryType,
} from "@ipfs/interfaces/data";
import {
	IConfigProvider,
	IConfigProviderType,
	IFileUtils,
	IFileUtilsType,
} from "@ipfs/interfaces/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
@injectable()
export class GoogleListener implements IGoogleListener {
	protected initializeResult: ResultAsync<void, IPFSUnavailableError> | null =
		null;

	public constructor(
		@inject(IBucketRepositoryType)
		protected googleBucketRepository: IBucketRepository,
		@inject(IConfigProviderType)
		protected configProvider: IConfigProvider,
		@inject(IEventRepositoryType)
		protected eventRepo: IEventRepository,
		@inject(IJobRepositoryType)
		protected jobRepository: IJobRepository,
		@inject(IAuthenticationServiceRepositoryType)
		protected authenticationServiceRepo: IAuthenticationServiceRepository,
		@inject(IFileUtilsType)
		protected fileUtils: IFileUtils,
		@inject(IUploadLocationRepositoryType)
		protected uploadLocationRepository: IUploadLocationRepository,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public initialize(): ResultAsync<void, BucketUnavailableError> {
		return this.googleBucketRepository
			.getSubscriptions()
			.map((subscriptions) => {
				subscriptions.forEach((subscription) => {
					this.listenSubscriptionMessages(subscription);
				});
			});
	}

	private listenSubscriptionMessages(subscription: Subscription): void {
		subscription.on("message", async (message: Message) => {
			try {
				const data = JSON.parse(message.data.toString());
				const filePath = data.filename;

				if (!filePath.includes("/")) {
					this.logger.debug(
						`Upload location does not exist for file: ${filePath}`,
					);
					return;
				}

				// Need to establish a user context for the event.
				// Get the file name and upload location id from path.
				// Then, emit file uploaded event based on the file type.
				const result = await ResultUtils.combine([
					this.authenticationServiceRepo.getSystemUserContext(),
					this.fileUtils.getFilenameFromFullPath(filePath),
					this.fileUtils.getUploadLocationIdFromFullPath(filePath),
				]).andThen(([userContext, filename, uploadLocationId]) => {
					return this.uploadLocationRepository
						.getById(uploadLocationId)
						.map((uploadLocation) => {
							if (filename.endsWith(".zip")) {
								this.eventRepo.zipFileUploaded(
									new ZipFileUploadedEvent(
										userContext,
										filename,
										uploadLocationId,
									),
								);
							} else {
								this.eventRepo.fileUploaded(
									new FileUploadedEvent(
										userContext,
										filename,
										uploadLocationId,
										uploadLocation?.locationIdentifier ||
											"",
										filePath,
									),
								);
							}
						});
				});

				if (result.isErr()) {
					throw result.error;
				}
			} catch (e) {
				this.logger.error(e);
				this.logger.error(
					"Bucket Listener failed to parse the message",
				);
			} finally {
				message.ack();
			}
		});
	}
}
