import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EventError extends BaseError {
	protected errorCode: string = errorCodes[EventError.name];
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, errorCodes[EventError.name], src, true);
	}
}
