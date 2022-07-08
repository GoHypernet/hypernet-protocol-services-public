import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class EthereumReadError extends BaseError {
	protected errorCode: string = errorCodes[EthereumReadError.name];
	constructor(msg: string, src: unknown | null) {
		super(msg, 500, errorCodes[EthereumReadError.name], src, true);
	}
}
