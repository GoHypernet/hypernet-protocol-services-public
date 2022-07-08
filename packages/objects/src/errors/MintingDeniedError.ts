import { BaseError, errorCodes } from "@objects/errors/BaseError";

export class MintingDeniedError extends BaseError {
	protected errorCode: string = errorCodes[MintingDeniedError.name];
	constructor(msg = "Minting Denied", src: unknown | null = null) {
		super(msg, 403, errorCodes[MintingDeniedError.name], src, false);
	}
}
