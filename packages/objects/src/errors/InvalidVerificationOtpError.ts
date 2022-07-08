import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidVerificationOtpError extends BaseError {
	protected errorCode: string = errorCodes[InvalidVerificationOtpError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(
			msg,
			403,
			errorCodes[InvalidVerificationOtpError.name],
			src,
			true,
		);
	}
}
