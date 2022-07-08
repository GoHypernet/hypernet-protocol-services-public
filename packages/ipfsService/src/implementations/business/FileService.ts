import {
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import {
	NewUploadLocation,
	UploadLocation,
	IPFSImportCandidate,
	EFileStatus,
	File,
	NewFile,
} from "@hypernetlabs/hypernet.id-ipfs-contracts";
import {
	BucketUnavailableError,
	DatabaseError,
	DeleteFileJob,
	EUploadLocationAccess,
	EUploadLocationFilePinning,
	FileCreatedEvent,
	FilePinnedOnIPFSEvent,
	FileSystemError,
	IPFSContentIdentifier,
	IPFSUnavailableError,
	ProcessZipFileErrorDetectedEvent,
	ProcessZipFileJob,
	QueueError,
	ResolvedUserContext,
	UnauthorizedError,
	UnknownEntityError,
	UploadFileJob,
	UploadLocationCreatedEvent,
	UrlString,
} from "@hypernetlabs/hypernet.id-objects";
import {
	IJobRepository,
	IJobRepositoryType,
} from "@hypernetlabs/hypernet.id-queues";
import { UUID } from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { DOWNLOADS_FOLDER_PATH } from "@ipfs/constants";
import { IFileService } from "@ipfs/interfaces/business";
import {
	IBucketRepository,
	IBucketRepositoryType,
	IFileRepository,
	IFileRepositoryType,
	IIPFSRepository,
	IIPFSRepositoryType,
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
import JSZip from "jszip";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class FileService implements IFileService {
	protected initializeResult: ResultAsync<
		void,
		BucketUnavailableError | IPFSUnavailableError
	> | null = null;

	public constructor(
		@inject(IFileRepositoryType)
		protected fileRepository: IFileRepository,
		@inject(IUploadLocationRepositoryType)
		protected uploadLocationRepository: IUploadLocationRepository,
		@inject(IIPFSRepositoryType)
		protected ipfsRepository: IIPFSRepository,
		@inject(IBucketRepositoryType)
		protected googleBucketRepository: IBucketRepository,
		@inject(IConfigProviderType)
		protected configProvider: IConfigProvider,
		@inject(IEventRepositoryType)
		protected eventRepo: IEventRepository,
		@inject(ILogUtilsType)
		protected logUtils: ILogUtils,
		@inject(IJobRepositoryType)
		protected jobRepository: IJobRepository,
		@inject(IFileUtilsType)
		protected fileUtils: IFileUtils,
	) {}

	public initialize(): ResultAsync<
		void,
		IPFSUnavailableError | BucketUnavailableError
	> {
		if (this.initializeResult == null) {
			this.initializeResult = ResultUtils.combine([
				this.ipfsRepository.initialize(),
				this.googleBucketRepository.initialize(),
			]).andThen(() => {
				return okAsync(undefined);
			});
		}
		return this.initializeResult;
	}

	public onFileUploaded(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<
		void,
		| DatabaseError
		| BucketUnavailableError
		| UnknownEntityError
		| IPFSUnavailableError
	> {
		return this.uploadLocationRepository
			.getById(uploadLocationId)
			.andThen((uploadLocation) => {
				if (uploadLocation == null) {
					return errAsync(
						new UnknownEntityError(
							`No Upload Location with id ${uploadLocationId}`,
						),
					);
				}

				return this.fileRepository
					.create(
						new NewFile(
							filename,
							uploadLocationId,
							EFileStatus.Uploaded,
							null,
						),
					)
					.andThen((file) => {
						const filePath = `${file.uploadLocationId}/${file.filename}`;
						this.logUtils.log(`File Path: ${filePath}`);
						const bucketFileUrl = this.generateBucketFileUrl(
							uploadLocation.googleBucketName,
							uploadLocation.id,
							file.filename,
						);

						this.eventRepo.fileCreated(
							new FileCreatedEvent(
								userContext,
								file.id,
								file.filename,
								file.uploadLocationId,
								null,
								uploadLocation.locationIdentifier,
								bucketFileUrl,
							),
						);

						// Check the file pinning flag in the upload location, end the flow if it is disabled.
						if (
							uploadLocation.filePinning ===
							EUploadLocationFilePinning.DISABLED
						) {
							return okAsync(undefined);
						}

						// Pin the uploaded file to IPFS.
						return this.googleBucketRepository
							.downloadFileIntoMemory(
								filePath,
								uploadLocation.googleBucketName,
							)
							.andThen((fileContent: Uint8Array) => {
								return this.ipfsRepository.saveFile(
									new IPFSImportCandidate(
										filePath,
										file.filename,
										fileContent,
									),
								);
							})
							.andThen((ipfsContentIdentifier) => {
								this.logUtils.log(
									`File with IPFS Content Identifier: ${ipfsContentIdentifier} is pinned.`,
								);
								return this.fileRepository
									.update(
										new File(
											file.id,
											file.filename,
											file.uploadLocationId,
											EFileStatus.Pinned,
											ipfsContentIdentifier,
											file.creationTimestamp,
											file.updatedTimestamp,
										),
									)
									.map((updatedFile) => {
										this.eventRepo.filePinned(
											new FilePinnedOnIPFSEvent(
												userContext,
												updatedFile.cid as IPFSContentIdentifier,
												updatedFile.uploadLocationId,
												updatedFile.id,
												updatedFile.filename,
											),
										);
									});
							});
					});
			});
	}

	public onZipFileUploaded(
		userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<void, FileSystemError | DatabaseError | QueueError> {
		return this.fileRepository
			.create(
				new NewFile(
					filename,
					uploadLocationId,
					EFileStatus.Uploaded,
					null,
				),
			)
			.andThen((file) => {
				return this.fileUtils
					.createDirectory(
						`${DOWNLOADS_FOLDER_PATH}/${uploadLocationId}`,
					)
					.andThen(() => {
						return this.jobRepository.sendProcessZipFileJob(
							new ProcessZipFileJob(
								userContext,
								file.id,
								file.filename,
								file.uploadLocationId,
							),
						);
					});
			});
	}

	public createUploadLocation(
		userContext: ResolvedUserContext,
		locationIdentifier: string,
		filePinning: EUploadLocationFilePinning,
		access: EUploadLocationAccess,
	): ResultAsync<UploadLocation, DatabaseError | IPFSUnavailableError> {
		return this.googleBucketRepository
			.getBucketNameByAccess(access)
			.andThen((bucketName) => {
				return this.uploadLocationRepository
					.create(
						new NewUploadLocation(
							locationIdentifier,
							bucketName,
							filePinning,
							access,
						),
					)
					.andThen((uploadLocation) => {
						return this.ipfsRepository
							.createDirectory(uploadLocation.id)
							.map(() => {
								this.eventRepo.uploadLocationCreated(
									new UploadLocationCreatedEvent(
										userContext,
										uploadLocation.id,
										uploadLocation.locationIdentifier,
										uploadLocation.googleBucketName,
										uploadLocation.filePinning,
										uploadLocation.access,
									),
								);
								return uploadLocation;
							});
					});
			});
	}

	public getUploadLink(
		uploadLocationId: UUID,
		filename: string,
	): ResultAsync<
		UrlString,
		DatabaseError | BucketUnavailableError | UnknownEntityError
	> {
		return ResultUtils.combine([
			this.uploadLocationRepository.getById(uploadLocationId),
			this.fileUtils.getFilePath(uploadLocationId, filename),
		]).andThen(([uploadLocation, filePath]) => {
			if (uploadLocation == null) {
				return errAsync(
					new UnknownEntityError(
						`No Upload Location with id ${uploadLocationId}`,
					),
				);
			}
			return this.googleBucketRepository.getUploadUrl(
				filePath,
				uploadLocation.access,
			);
		});
	}

	public processZipFile(
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
	> {
		this.logUtils.log(
			`Process started for File ID: ${fileId} and File Name: ${filename}`,
		);
		return ResultUtils.combine([
			this.uploadLocationRepository.getById(uploadLocationId),
			this.fileUtils.getFilePath(uploadLocationId, filename),
		])
			.andThen(([uploadLocation, filePath]) => {
				if (uploadLocation == null) {
					return errAsync(
						new UnknownEntityError(
							`No Upload Location with id ${uploadLocationId}`,
						),
					);
				}

				return this.googleBucketRepository
					.downloadFile(filePath, uploadLocation.googleBucketName)
					.andThen(() => {
						return okAsync(`${DOWNLOADS_FOLDER_PATH}/${filePath}`);
					});
			})
			.andThen((downloadedFilePath) => {
				return this.fileUtils.readFile(downloadedFilePath);
			})
			.andThen((file) => {
				return this.fileUtils.deserializeZipFile(file);
			})
			.andThen((zip) => {
				return this.extractFilesFromZip(
					userContext,
					zip,
					uploadLocationId,
				);
			})
			.andThen(() => {
				return this.jobRepository.sendDeleteFileJob(
					new DeleteFileJob(userContext, filename, uploadLocationId),
				);
			});
	}

	public pinFile(
		uploadLocationId: UUID,
		file: IPFSImportCandidate,
	): ResultAsync<
		File,
		DatabaseError | IPFSUnavailableError | UnknownEntityError
	> {
		return this.uploadLocationRepository
			.getById(uploadLocationId)
			.andThen((uploadLocation) => {
				if (uploadLocation == null) {
					return errAsync(
						new UnknownEntityError(
							`No Upload Location with id ${uploadLocationId}`,
						),
					);
				}

				if (
					uploadLocation.filePinning ===
					EUploadLocationFilePinning.DISABLED
				) {
					return errAsync(
						new IPFSUnavailableError(
							"Upload Location does not support pinning",
						),
					);
				}

				return this.ipfsRepository.saveFile(file).andThen((cid) => {
					this.logUtils.debug("IPFSService pinFile", cid);
					return this.fileRepository.create(
						new NewFile(
							file.filename,
							uploadLocationId,
							EFileStatus.Pinned,
							cid,
						),
					);
				});
			});
	}

	protected extractFilesFromZip(
		userContext: ResolvedUserContext,
		zipFileInstance: JSZip,
		uploadLocationId: UUID,
	): ResultAsync<void, FileSystemError | QueueError> {
		const resultPromises: ResultAsync<
			void,
			FileSystemError | QueueError
		>[] = [];

		for (const filename of Object.keys(zipFileInstance.files)) {
			resultPromises.push(
				this.extractFile(
					userContext,
					zipFileInstance,
					filename,
					uploadLocationId,
				),
			);
		}

		return ResultUtils.combine(resultPromises)
			.andThen(() => {
				return okAsync(undefined);
			})
			.orElse((e) => {
				this.logUtils.debug(e);
				return okAsync(undefined);
			});
	}

	protected extractFile(
		userContext: ResolvedUserContext,
		zipFileInstance: JSZip,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<void, FileSystemError | QueueError> {
		// We are making sure that file name doesn't have any folders.
		// Even if it consists, we just ignore them.
		return this.fileUtils
			.getFilenameFromFullPath(filename)
			.andThen((filename) => {
				return ResultUtils.combine([
					this.fileUtils.getFilePath(uploadLocationId, filename),
					this.fileUtils.getFileContentByFilename(
						zipFileInstance,
						filename,
					),
				])
					.andThen(([newFilePath, content]) => {
						return this.fileUtils.writeFile(
							`${DOWNLOADS_FOLDER_PATH}/${newFilePath}`,
							content,
						);
					})
					.andThen(() => {
						return this.jobRepository.sendUploadFileJob(
							new UploadFileJob(
								userContext,
								filename,
								uploadLocationId,
							),
						);
					})
					.orElse((e) => {
						this.logUtils.error(
							`Error extracting file: ${filename}`,
							e,
						);
						this.eventRepo.processZipFileErrorDetected(
							new ProcessZipFileErrorDetectedEvent(
								userContext,
								zipFileInstance.name,
								filename,
								uploadLocationId,
							),
						);
						return okAsync(undefined);
					});
			});
	}

	public processUploadFileJob(
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
	> {
		return ResultUtils.combine([
			this.uploadLocationRepository.getById(uploadLocationId),
			this.fileUtils.getFilePath(uploadLocationId, filename),
		]).andThen(([uploadLocation, filePath]) => {
			if (uploadLocation == null) {
				return errAsync(
					new UnknownEntityError(
						`No Upload Location with id ${uploadLocationId}`,
					),
				);
			}
			return this.fileUtils
				.readFile(`${DOWNLOADS_FOLDER_PATH}/${filePath}`)
				.andThen((content) => {
					return this.googleBucketRepository.uploadFile(
						filePath,
						content,
						uploadLocation.googleBucketName,
					);
				})
				.andThen(() => {
					return this.jobRepository.sendDeleteFileJob(
						new DeleteFileJob(
							userContext,
							filename,
							uploadLocationId,
						),
					);
				});
		});
	}

	public processDeleteFileJob(
		_userContext: ResolvedUserContext,
		filename: string,
		uploadLocationId: UUID,
	): ResultAsync<void, BucketUnavailableError | FileSystemError> {
		return this.fileUtils
			.getFilePath(uploadLocationId, filename)
			.andThen((path) => {
				return this.fileUtils.deleteFile(
					`${DOWNLOADS_FOLDER_PATH}/${path}`,
				);
			});
	}

	protected generateBucketFileUrl(
		googleBucketName: string,
		uploadLocationId: UUID,
		filename: string,
	): UrlString {
		return UrlString(
			`https://storage.googleapis.com/${googleBucketName}/${uploadLocationId}/${filename}`,
		);
	}
}
