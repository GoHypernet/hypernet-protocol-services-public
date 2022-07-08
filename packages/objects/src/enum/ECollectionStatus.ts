import { Result, ok, err } from "neverthrow";

import { InvalidConversionError } from "@objects/errors";

export enum ECollectionStatus {
	Defining = 0, // NFTs are still being defined, nothing is submitted to the chain
	Minting = 1, // NFTs that are in ReadyToMint status are actively submitted for minting
	Complete = 2, // Identical to Minting, except there are no NFTs in the ReadyToMint status.
}

export function stringToCollectionStatus(
	str: string,
): Result<ECollectionStatus, InvalidConversionError> {
	const lowerStr = str.toLowerCase();
	if (lowerStr == "defining") {
		return ok(ECollectionStatus.Defining);
	}
	if (lowerStr == "minting") {
		return ok(ECollectionStatus.Minting);
	}
	if (lowerStr == "complete") {
		return ok(ECollectionStatus.Complete);
	}
	return err(
		new InvalidConversionError(
			`"${str}" is not a valid ECollectionStatus`,
			null,
		),
	);
}

export function collectionStatusToString(status: ECollectionStatus): string {
	if (status == ECollectionStatus.Defining) {
		return "Defining";
	}
	if (status == ECollectionStatus.Minting) {
		return "Minting";
	}
	return "Complete";
}
