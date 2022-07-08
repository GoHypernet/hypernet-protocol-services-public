import { AESKey } from "@hypernetlabs/common-objects";
import {
	DatabaseError,
	IdentityId,
	JWKSError,
	ResolvedUserContext,
	UnauthorizedError,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAuthorizationService {
	getIdentityKey(
		userContext: ResolvedUserContext,
		serviceToken: JsonWebToken,
		identityId: IdentityId,
	): ResultAsync<AESKey, UnauthorizedError | DatabaseError | JWKSError>;
}

export const IAuthorizationServiceType = Symbol.for("IAuthorizationService");
