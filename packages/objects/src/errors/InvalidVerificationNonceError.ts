import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidVerificationNonceError extends BaseError {
	protected errorCode: string =
		errorCodes[InvalidVerificationNonceError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(
			msg,
			403,
			errorCodes[InvalidVerificationNonceError.name],
			src,
			true,
		);
	}
}
