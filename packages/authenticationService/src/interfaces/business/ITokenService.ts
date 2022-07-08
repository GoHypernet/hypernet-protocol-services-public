import {
	CorporateId,
	DatabaseError,
	InvalidSignatureError,
	JWKSError,
	Nonce,
	RedisError,
	ResolvedToken,
	ResolvedUserContext,
	UnauthorizedError,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ITokenService {
	exchangeCorporateSecretForToken(
		userContext: ResolvedUserContext,
		corporateId: CorporateId,
		corporateSecret: Nonce,
	): ResultAsync<
		JsonWebToken,
		DatabaseError | UnauthorizedError | InvalidSignatureError | RedisError
	>;

	resolveToken(token: JsonWebToken): ResultAsync<ResolvedToken, JWKSError>;
}

export const ITokenServiceType = Symbol.for("ITokenService");
