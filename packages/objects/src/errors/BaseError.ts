/**
 * BaseError is exactly MoleculerError, and is thus compatible with Moleculer, but it does not require the import of Moleculer, so that the requirements for the Objects package can be
 * kept extremely low.
 */
export class BaseError extends Error {
	public code: number;
	public type: string;
	public data: unknown;
	public retryable: boolean;

	constructor(
		message: string,
		code: number,
		type: string,
		data: unknown,
		retryable: boolean,
	) {
		super(message);
		this.code = code || 500;
		this.type = type;
		this.data = data;
		this.retryable = retryable;
	}
}

export const errorCodes = {
	BlockchainUnavailableError: "ERR_BLOCKCHAIN_UNAVAILABLE",
	BucketUnavailableError: "ERR_BUCKET_UNAVAILABLE",
	DatabaseError: "ERR_DATABASE",
	EmailError: "ERR_EMAIL",
	EmailNotVerifiedError: "ERR_EMAIL_NOT_VERIFIED",
	EncryptionKeyUnavailableError: "ENCRYPTION_KEY_UNAVAILABLE_ERR",
	EthereumReadError: "ERR_ETHEREUM_READ",
	EthereumWriteError: "ERR_ETHEREUM_WRITE",
	EventError: "ERR_EVENT",
	FileNotFoundError: "ERR_FILE_NOT_FOUND",
	FileSystemError: "ERR_FILE_SYSTEM",
	IdentityVerificationFailedError: "ERR_IDENTITY_VERIFICATION_FAILED",
	InvalidConversionError: "ERR_INVALID_CONVERSION",
	InvalidHypernetProfileTokenError: "ERR_INVALID_PROFILE_TOKEN",
	InvalidIdentityTokenError: "ERR_INVALID_IDENTITY_TOKEN",
	InvalidSignatureError: "ERR_INVALID_SIGNATURE",
	InvalidVerificationNonceError: "ERR_INVALID_EMAIL_VERIFICATION_NONCE",
	InvalidVerificationOtpError: "ERR_INVALID_EMAIL_VERIFICATION_OTP",
	IPFSUnavailableError: "ERR_IPFS_UNAVAILABLE",
	JWKSError: "ERR_JWKS",
	MintingDeniedError: "ERR_MINTING_DENIED",
	QueueError: "ERR_QUEUE",
	RedisError: "ERR_REDIS",
	UnauthenticatedError: "ERR_UNAUTHENTICATED",
	UnauthorizedError: "ERR_UNAUTHORIZED",
	UnknownEntityError: "ERR_UNKNOWN_ENTITY",
};
