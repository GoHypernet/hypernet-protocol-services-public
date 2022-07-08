import { BaseError, errorCodes } from "./BaseError";

export class UnauthenticatedError extends BaseError {
	protected errorCode: string = errorCodes[UnauthenticatedError.name];
	constructor(msg = "Unauthenticated", src: unknown | null = null) {
		super(msg, 401, errorCodes[UnauthenticatedError.name], src, false);
	}
}
