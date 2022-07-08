import { BucketUnavailableError } from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

export interface IGoogleListener {
	initialize(): ResultAsync<void, BucketUnavailableError>;
}

export const IGoogleListenerType = Symbol.for("IGoogleListener");
