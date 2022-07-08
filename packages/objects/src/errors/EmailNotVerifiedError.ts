import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EmailNotVerifiedError extends BaseError {
	protected errorCode: string = errorCodes[EmailNotVerifiedError.name];
	constructor(msg: string, src: unknown | null) {
		super(
			`${msg} ${
				(src as Error)?.message ? `: ${(src as Error)?.message}` : ``
			}`,
			403,
			errorCodes[EmailNotVerifiedError.name],
			src,
			false,
		);
	}
}
