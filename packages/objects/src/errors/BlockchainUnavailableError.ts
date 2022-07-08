import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class BlockchainUnavailableError extends BaseError {
	protected errorCode: string = errorCodes[BlockchainUnavailableError.name];
	constructor(msg: string, src: unknown | null) {
		super(
			msg,
			500,
			errorCodes[BlockchainUnavailableError.name],
			src,
			false,
		);
	}
}
