import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class IdentityVerificationFailedError extends BaseError {
	protected errorCode: string =
		errorCodes[IdentityVerificationFailedError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(
			msg,
			500,
			errorCodes[IdentityVerificationFailedError.name],
			src,
			true,
		);
	}
}
