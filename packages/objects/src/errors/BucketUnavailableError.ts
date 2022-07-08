import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class BucketUnavailableError extends BaseError {
	protected errorCode: string = errorCodes[BucketUnavailableError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, errorCodes[BucketUnavailableError.name], src, true);
	}
}
