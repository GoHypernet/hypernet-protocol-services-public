import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidConversionError extends BaseError {
	protected errorCode: string = errorCodes[InvalidConversionError.name];
	constructor(msg: string, src: unknown | null) {
		super(
			`${msg} ${
				(src as Error)?.message ? `: ${(src as Error)?.message}` : ``
			}`,
			500,
			errorCodes[InvalidConversionError.name],
			src,
			false,
		);
	}
}
