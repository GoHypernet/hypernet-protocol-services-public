import JSZip from "jszip";
import fs from "fs";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { FileSystemError } from "@hypernetlabs/hypernet.id-objects";
import { IFileUtils } from "@ipfs/interfaces/utils";
import { UUID } from "@hypernetlabs/objects";

@injectable()
export class FileUtils implements IFileUtils {
	protected jsZipInstance: JSZip;

	constructor() {
		this.jsZipInstance = new JSZip();
	}

	public createDirectory(
		directoryName: string,
	): ResultAsync<void, FileSystemError> {
		if (!fs.existsSync(directoryName)) {
			return ResultAsync.fromPromise(
				fs.promises.mkdir(directoryName),
				(e) => {
					return new FileSystemError(
						"Error during creating directory.",
					);
				},
			);
		}

		return okAsync(undefined);
	}

	public deleteFile(path: string): ResultAsync<void, FileSystemError> {
		return ResultAsync.fromPromise(fs.promises.rm(path), (e) => {
			return new FileSystemError("Error during removing the file.");
		});
	}

	public deserializeZipFile(
		buffer: Buffer,
	): ResultAsync<JSZip, FileSystemError> {
		return ResultAsync.fromPromise(
			this.jsZipInstance.loadAsync(buffer),
			(e) => {
				return new FileSystemError(
					"Error during deserializing the zip file.",
				);
			},
		);
	}

	public readFile(path: string): ResultAsync<Buffer, FileSystemError> {
		return ResultAsync.fromPromise(fs.promises.readFile(path), (e) => {
			return new FileSystemError("Error during reading the file.");
		});
	}

	public writeFile(
		path: string,
		content: Buffer,
	): ResultAsync<void, FileSystemError> {
		return ResultAsync.fromPromise(
			fs.promises.writeFile(path, content),
			(e) => {
				return new FileSystemError("Error during writing the file.");
			},
		);
	}

	public getFileContentByFilename(
		zip: JSZip,
		filename: string,
	): ResultAsync<Buffer, FileSystemError> {
		const file = zip.files[filename];
		return ResultAsync.fromPromise(file.async("nodebuffer"), (e) => {
			return new FileSystemError(
				"Error during getting the file content from zip file.",
			);
		});
	}

	public getFilenameFromFullPath(
		fullPath: string,
	): ResultAsync<string, never> {
		const seperatorIndex = fullPath.lastIndexOf("/");
		return okAsync(fullPath.substring(seperatorIndex + 1));
	}

	public getUploadLocationIdFromFullPath(
		fullPath: string,
	): ResultAsync<UUID, never> {
		const seperatorIndex = fullPath.indexOf("/");
		const uploadLocationId = UUID(fullPath.substring(0, seperatorIndex));
		return okAsync(uploadLocationId);
	}

	public getFilePath(
		uploadLocationId: UUID,
		filename: string,
	): ResultAsync<string, never> {
		return okAsync(`${uploadLocationId}/${filename}`);
	}
}
