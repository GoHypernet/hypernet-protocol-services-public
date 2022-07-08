import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidSignatureError extends BaseError {
	protected errorCode: string = errorCodes[InvalidSignatureError.name];
	constructor(message: string, public src?: unknown) {
		super(message, 500, errorCodes[InvalidSignatureError.name], src, false);
	}
}
