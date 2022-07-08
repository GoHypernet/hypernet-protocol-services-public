"use strict";
import "reflect-metadata";
import {
	CreateUploadLocation,
	GetUploadLink,
	PinFile,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import {
	BucketUnavailableError,
	ContextMeta,
	EService,
	FilePinnedOnIPFSEvent,
	FileCreatedEvent,
	FileUploadedEvent,
	IPFSUnavailableError,
	ProcessZipFileJob,
	ZipFileUploadedEvent,
	ProcessZipFileErrorDetectedEvent,
	UploadFileJob,
	DeleteFileJob,
} from "@hypernetlabs/hypernet.id-objects";
import {
	JobProcessor,
	SecureService,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ResultUtils } from "@hypernetlabs/utils";
import { ipfsModule } from "@ipfs/implementations/modules";
import { IGoogleListener, IGoogleListenerType } from "@ipfs/interfaces/api";
import { IFileService, IFileServiceType } from "@ipfs/interfaces/business";
import { ContainerModule } from "inversify";
import { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";
import { okAsync, ResultAsync } from "neverthrow";

export default class IPFSService extends SecureService {
	public onStarted(): ResultAsync<
		void,
		IPFSUnavailableError | BucketUnavailableError
	> {
		const fileService = this.container.get<IFileService>(IFileServiceType);
		const listener =
			this.container.get<IGoogleListener>(IGoogleListenerType);

		return ResultUtils.combine([
			fileService.initialize(),
			listener.initialize(),
		]).map(() => {});
	}

	public getQueueProcessors(): JobProcessor[] {
		return [
			new JobProcessor<ProcessZipFileJob, IFileService>(
				`IPFS-ZipFileProcess`,
				IFileServiceType,
				(job, ruc, fileService) => {
					this.logger.debug(`IPFS-ZipFileProcess ${job.fileId}`);

					return fileService
						.processZipFile(
							ruc,
							job.fileId,
							job.filename,
							job.uploadLocationId,
						)
						.map(() => {});
				},
			),
			new JobProcessor<UploadFileJob, IFileService>(
				`IPFS-FileUpload`,
				IFileServiceType,
				(job, ruc, fileService) => {
					this.logger.debug(`IPFS-FileUpload ${job.filename}`);

					return fileService
						.processUploadFileJob(
							ruc,
							job.filename,
							job.uploadLocationId,
						)
						.map(() => {});
				},
			),
			new JobProcessor<DeleteFileJob, IFileService>(
				`IPFS-FileDelete`,
				IFileServiceType,
				(job, ruc, fileService) => {
					this.logger.debug(`IPFS-FileDelete ${job.filename}`);

					return fileService
						.processDeleteFileJob(
							ruc,
							job.filename,
							job.uploadLocationId,
						)
						.map(() => {});
				},
			),
		];
	}

	public getServiceName(): string {
		return EService.IPFS;
	}
	public getServiceSchema(): Partial<ServiceSchema<ServiceSettingSchema>> {
		return {
			actions: {
				[CreateUploadLocation.actionName]: {
					handler: async (
						ctx: Context<CreateUploadLocation, ContextMeta>,
					) => {
						return this.signedActionHandler<IFileService>(
							ctx,
							IFileServiceType,
							(ruc, fileService) => {
								return fileService.createUploadLocation(
									ruc,
									ctx.params.locationIdentifier,
									ctx.params.filePinning,
									ctx.params.access
								);
							},
						);
					},
				},
				[GetUploadLink.actionName]: {
					handler: async (
						ctx: Context<GetUploadLink, ContextMeta>,
					) => {
						return this.signedActionHandler<IFileService>(
							ctx,
							IFileServiceType,
							(ruc, fileService) => {
								return fileService.getUploadLink(
									ctx.params.uploadLocationId,
									ctx.params.filename,
								);
							},
						);
					},
				},
				[PinFile.actionName]: {
					handler: async (ctx: Context<PinFile, ContextMeta>) => {
						return this.signedActionHandler<IFileService>(
							ctx,
							IFileServiceType,
							(ruc, fileService) => {
								return fileService.pinFile(
									ctx.params.uploadLocationId,
									ctx.params.file,
								);
							},
						);
					},
				},
			},
			channels: {
				[FileUploadedEvent.eventName]: {
					group: EService.IPFS,
					maxInFlight: 2,
					handler: async (payload: FileUploadedEvent) => {
						return this.signedEventHandler<
							IFileService,
							FileUploadedEvent
						>(
							FileUploadedEvent.eventName,
							payload,
							IFileServiceType,
							(ruc, pl, fileService) => {
								return fileService.onFileUploaded(
									ruc,
									pl.filename,
									pl.uploadLocationId,
								);
							},
						);
					},
				},

				[ZipFileUploadedEvent.eventName]: {
					group: EService.IPFS,
					maxInFlight: 2,
					handler: async (payload: ZipFileUploadedEvent) => {
						return this.signedEventHandler<
							IFileService,
							ZipFileUploadedEvent
						>(
							ZipFileUploadedEvent.eventName,
							payload,
							IFileServiceType,
							(ruc, pl, fileService) => {
								return fileService.onZipFileUploaded(
									ruc,
									pl.filename,
									pl.uploadLocationId,
								);
							},
						);
					},
				},

				[FileCreatedEvent.eventName]: {
					group: EService.IPFS,
					maxInFlight: 2,
					handler: async (payload: FileCreatedEvent) => {
						return this.signedEventHandler<
							IFileService,
							FileCreatedEvent
						>(
							FileCreatedEvent.eventName,
							payload,
							IFileServiceType,
							(ruc, pl, fileService) => {
								this.broker.logger.debug(
									`IPFS Service: ${FileCreatedEvent.eventName}`,
								);

								this.broker.logger.debug(
									`File Created File ID: ${payload.fileId}`,
								);
								return okAsync(undefined);
							},
						);
					},
				},
				[FilePinnedOnIPFSEvent.eventName]: {
					group: EService.IPFS,
					maxInFlight: 2,
					handler: async (payload: FilePinnedOnIPFSEvent) => {
						return this.signedEventHandler<
							IFileService,
							FilePinnedOnIPFSEvent
						>(
							FilePinnedOnIPFSEvent.eventName,
							payload,
							IFileServiceType,
							(ruc, pl, fileService) => {
								this.broker.logger.debug(
									`IPFS Service: ${FilePinnedOnIPFSEvent.eventName}`,
								);

								this.broker.logger.debug(
									`File Pinned CID: ${payload.cid}`,
								);
								return okAsync(undefined);
							},
						);
					},
				},

				[ProcessZipFileErrorDetectedEvent.eventName]: {
					group: EService.IPFS,
					maxInFlight: 2,
					handler: async (
						payload: ProcessZipFileErrorDetectedEvent,
					) => {
						return this.signedEventHandler<
							IFileService,
							ProcessZipFileErrorDetectedEvent
						>(
							ProcessZipFileErrorDetectedEvent.eventName,
							payload,
							IFileServiceType,
							(ruc, pl, fileService) => {
								this.broker.logger.debug(
									`Failed file to process file: ${payload.uploadLocationId}/${payload.extractedfilename}`,
								);
								return okAsync(undefined);
							},
						);
					},
				},
			},
		};
	}

	public modules(): ContainerModule[] {
		return [ipfsModule, securityModule];
	}
}
