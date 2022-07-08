import { GetIdentityKey } from "@authorizationContracts/actions";
import { AESKey } from "@hypernetlabs/common-objects";
import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	DatabaseError,
	InvalidSignatureError,
	JWKSError,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

export interface IAuthorizationServiceRepository {
	getIdentityKey(
		userContext: UserContext,
		request: GetIdentityKey,
	): ResultAsync<
		AESKey,
		| UnauthorizedError
		| DatabaseError
		| JWKSError
		| RedisError
		| InvalidSignatureError
	>;
}

export const IAuthorizationServiceRepositoryType = Symbol.for(
	"IAuthorizationServiceRepository",
);
