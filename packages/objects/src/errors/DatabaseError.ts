import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class DatabaseError extends BaseError {
	protected errorCode: string = errorCodes[DatabaseError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[DatabaseError.name], src, true);
	}
}
