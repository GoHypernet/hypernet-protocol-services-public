import { RedisError } from "@hypernetlabs/common-redis-provider";
import {
	EService,
	InvalidSignatureError,
	Nonce,
	ReferralLinkId,
	ResolvedUserContext,
	UnauthorizedError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumAccountAddress,
	JsonWebToken,
	Signature,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWalletAuthenticationService {
	getCurrentNonce(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<string, RedisError>;

	getCurrentServiceNonce(
		service: EService,
	): ResultAsync<string, RedisError | UnauthorizedError>;

	getMessage(referralLinkId?: ReferralLinkId): string;

	submitSignedNonce(
		userContext: ResolvedUserContext,
		accountAddress: EthereumAccountAddress,
		signature: Signature,
		referralLinkId?: ReferralLinkId,
		nftNonce?: Nonce,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError>;

	submitSignedServiceNonce(
		service: EService,
		signature: Signature,
	): ResultAsync<JsonWebToken, RedisError | InvalidSignatureError>;
}

export const IWalletAuthenticationServiceType = Symbol.for(
	"IWalletAuthenticationService",
);
