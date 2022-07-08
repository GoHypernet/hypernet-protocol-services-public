import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidHypernetProfileTokenError extends BaseError {
	protected errorCode: string =
		errorCodes[InvalidHypernetProfileTokenError.name];
	constructor(msg: string, src: unknown | null) {
		super(
			msg,
			500,
			errorCodes[InvalidHypernetProfileTokenError.name],
			src,
			false,
		);
	}
}
