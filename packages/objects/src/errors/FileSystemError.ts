import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class FileSystemError extends BaseError {
	protected errorCode: string = errorCodes[FileSystemError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, errorCodes[FileSystemError.name], src, true);
	}
}
