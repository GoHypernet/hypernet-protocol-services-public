import {
	NonFungibleRegistryContractError,
	GasPriceError,
	TransactionNotImplementedError,
	TransactionServerError,
	TransactionTimeoutError,
	TransactionUnknownError,
	TransactionUnsupportedOperationError,
	BatchModuleContractError,
} from "@hypernetlabs/objects";

import { BlockchainUnavailableError } from "@objects/errors/BlockchainUnavailableError";

export type MintBlockchainErrors =
	| BlockchainUnavailableError
	| NonFungibleRegistryContractError
	| BatchModuleContractError
	| GasPriceError
	| TransactionNotImplementedError
	| TransactionServerError
	| TransactionTimeoutError
	| TransactionUnknownError
	| TransactionUnsupportedOperationError;
