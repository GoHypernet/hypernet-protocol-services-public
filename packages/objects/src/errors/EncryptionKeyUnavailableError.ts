import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EncryptionKeyUnavailableError extends BaseError {
	protected errorCode: string =
		errorCodes[EncryptionKeyUnavailableError.name];
	constructor(msg: string, src?: unknown | null) {
		super(
			msg,
			500,
			errorCodes[EncryptionKeyUnavailableError.name],
			src,
			false,
		);
	}
}
