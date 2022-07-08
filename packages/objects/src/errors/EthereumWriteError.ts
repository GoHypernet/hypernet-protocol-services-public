import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EthereumWriteError extends BaseError {
	protected errorCode: string = errorCodes[EthereumWriteError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[EthereumWriteError.name], src, true);
	}
}
