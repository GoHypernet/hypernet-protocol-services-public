import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class UnknownEntityError extends BaseError {
	protected errorCode: string = errorCodes[UnknownEntityError.name];
	constructor(msg = "Unknown Object", src: unknown | null = null) {
		super(msg, 403, errorCodes[UnknownEntityError.name], src, false);
	}
}
