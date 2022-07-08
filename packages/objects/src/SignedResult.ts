import { Signature } from "@hypernetlabs/objects";

export class SignedResult<T> {
	constructor(public result: T, public signature: Signature) {}
}
