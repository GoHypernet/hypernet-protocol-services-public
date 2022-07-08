import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	DatabaseError,
	InvalidSignatureError,
	JWKSError,
	ResolvedToken,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { JsonWebToken } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import {
	ExchangeCorporateSecretForToken,
	GetMessage,
	GetNonce,
	GetServiceNonce,
	ResolveToken,
	SubmitSignedNonce,
	SubmitSignedServiceNonce,
} from "@authenticationContracts/actions";

export interface IAuthenticationServiceRepository {
	exchangeCorporateSecretForToken(
		userContext: UserContext,
		request: ExchangeCorporateSecretForToken,
	): ResultAsync<
		JsonWebToken,
		DatabaseError | UnauthorizedError | InvalidSignatureError | RedisError
	>;
	getNonce(
		userContext: UserContext,
		request: GetNonce,
	): ResultAsync<string, RedisError>;
	getMessage(
		userContext: UserContext,
		request: GetMessage,
	): ResultAsync<string, RedisError>;
	getServiceNonce(
		request: GetServiceNonce,
	): ResultAsync<string, RedisError | UnauthorizedError>;
	resolveToken(request: ResolveToken): ResultAsync<ResolvedToken, JWKSError>;
	submitSignedNonce(
		userContext: UserContext,
		request: SubmitSignedNonce,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError>;
	submitSignedServiceNonce(
		request: SubmitSignedServiceNonce,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError>;

	getServiceToken(): ResultAsync<
		JsonWebToken,
		RedisError | UnauthorizedError | InvalidSignatureError
	>;

	getSystemUserContext(): ResultAsync<
		UserContext,
		RedisError | UnauthorizedError | InvalidSignatureError
	>;
}

export const IAuthenticationServiceRepositoryType = Symbol.for(
	"IAuthenticationServiceRepository",
);
