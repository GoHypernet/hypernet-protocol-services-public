import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class IPFSUnavailableError extends BaseError {
	protected errorCode: string = errorCodes[IPFSUnavailableError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, errorCodes[IPFSUnavailableError.name], src, true);
	}
}
