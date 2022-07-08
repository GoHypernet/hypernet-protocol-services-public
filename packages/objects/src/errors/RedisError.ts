import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class RedisError extends BaseError {
	protected errorCode: string = errorCodes[RedisError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[RedisError.name], src, true);
	}
}
