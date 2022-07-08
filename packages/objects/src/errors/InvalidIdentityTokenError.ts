import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class InvalidIdentityTokenError extends BaseError {
	protected errorCode: string = errorCodes[InvalidIdentityTokenError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[InvalidIdentityTokenError.name], src, false);
	}
}
