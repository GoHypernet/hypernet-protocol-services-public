import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class UnauthorizedError extends BaseError {
	protected errorCode: string = errorCodes[UnauthorizedError.name];
	constructor(msg = "Unauthorized", src: unknown | null = null) {
		super(msg, 401, errorCodes[UnauthorizedError.name], src, false);
	}
}
