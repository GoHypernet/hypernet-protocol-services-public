import { FileSystemError } from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";
import JSZip from "jszip";
import { UUID } from "@hypernetlabs/objects";

export interface IFileUtils {
	/**
	 * Creates a directory into the file system by the given directory name.
	 *
	 */
	createDirectory: (
		directoryName: string,
	) => ResultAsync<void, FileSystemError>;

	/**
	 * Deletes a file from the file system by the given path.
	 * @returns Buffer
	 */
	deleteFile(path: string): ResultAsync<void, FileSystemError>;

	/**
	 * Deserializes a zip file asynchronously.
	 * @returns JsZip instance.
	 */
	deserializeZipFile: (buffer: Buffer) => ResultAsync<JSZip, FileSystemError>;

	/**
	 * Returns a file content inside the zip file by requested file name.
	 * @returns Buffer.
	 */
	getFileContentByFilename: (
		zip: JSZip,
		filename: string,
	) => ResultAsync<Buffer, FileSystemError>;

	/**
	 * Returns a file path from combination of upload location id and file name.
	 * @returns string.
	 */
	getFilePath(
		uploadLocationId: UUID,
		filename: string,
	): ResultAsync<string, never>;

	/**
	 * Returns a file name from a file path.
	 * @returns string.
	 */
	getFilenameFromFullPath(fullPath: string): ResultAsync<string, never>;

	/**
	 * Returns a upload location id from a file path.
	 * @returns string.
	 */
	getUploadLocationIdFromFullPath(
		fullPath: string,
	): ResultAsync<UUID, never>;

	/**
	 * Reads a file by the given path from the file system.
	 * @returns Buffer
	 */
	readFile: (path: string) => ResultAsync<Buffer, FileSystemError>;

	/**
	 * Writes a file into the file system by the given path and content.
	 * @returns Buffer
	 */
	writeFile(
		path: string,
		content: Buffer,
	): ResultAsync<void, FileSystemError>;
}

export const IFileUtilsType = Symbol.for("IFileUtils");
