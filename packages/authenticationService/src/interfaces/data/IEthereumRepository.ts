import { IdentityToken } from "@hypernetlabs/hypernet-id-objects";
import {
	BlockchainUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	IdentityDoc,
	InvalidIdentityTokenError,
} from "@hypernetlabs/hypernet.id-objects";
import { EthereumAddress } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IEthereumRepository {
	mintIdentityToken(
		identity: IdentityDoc,
	): ResultAsync<
		IdentityToken,
		| BlockchainUnavailableError
		| EthereumReadError
		| EthereumWriteError
		| InvalidIdentityTokenError
	>;

	getIdentityTokenByAccount(
		accountAddress: EthereumAddress,
	): ResultAsync<
		IdentityToken,
		| BlockchainUnavailableError
		| EthereumReadError
		| InvalidIdentityTokenError
	>;
}

export const IEthereumRepositoryType = Symbol.for("IEthereumRepository");
