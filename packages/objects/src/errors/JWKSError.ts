import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class JWKSError extends BaseError {
	protected errorCode: string = errorCodes[JWKSError.name];
	constructor(message: string, public src?: unknown) {
		super(message, 401, errorCodes[JWKSError.name], src, false);
	}
}
