import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class FileNotFoundError extends BaseError {
	protected errorCode: string = errorCodes[FileNotFoundError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, errorCodes[FileNotFoundError.name], src, true);
	}
}
