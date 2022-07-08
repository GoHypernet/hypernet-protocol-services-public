import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EmailError extends BaseError {
	protected errorCode: string = errorCodes[EmailError.name];
	constructor(msg: string, src: unknown | null) {
		super(
			`${msg} ${
				(src as Error)?.message ? `: ${(src as Error)?.message}` : ``
			}`,
			500,
			errorCodes[EmailError.name],
			src,
			true,
		);
	}
}
