import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class QueueError extends BaseError {
	protected errorCode: string = errorCodes[QueueError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[QueueError.name], src, true);
	}
}
