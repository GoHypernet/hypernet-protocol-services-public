import { RedisError } from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

export interface IConcurrencyUtils {
	performWithLock<T, E>(
		lockName: string | string[],
		func: () => ResultAsync<T, E>,
		lockTime?: number,
	): ResultAsync<T, RedisError | E>;
}

export const IConcurrencyUtilsType = Symbol.for("IConcurrencyUtils");
