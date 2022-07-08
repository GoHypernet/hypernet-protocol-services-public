import { CursorPagedResponse } from "@hypernetlabs/hypernet.id-objects";
import { okAsync, ResultAsync } from "neverthrow";

export class ObjectUtils {
	// Taken from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static mergeDeep<T>(...objects: any[]): unknown {
		const isObject = (obj) => obj && typeof obj === "object";

		return objects.reduce((prev, obj) => {
			Object.keys(obj).forEach((key) => {
				const pVal = prev[key];
				const oVal = obj[key];

				if (Array.isArray(pVal) && Array.isArray(oVal)) {
					prev[key] = pVal.concat(...oVal);
				} else if (isObject(pVal) && isObject(oVal)) {
					prev[key] = ObjectUtils.mergeDeep(pVal, oVal);
				} else {
					prev[key] = oVal;
				}
			});

			return prev;
		}, {});
	}

	static iterateCursor<T, TCursor, TError>(
		readFunc: (
			cursor: TCursor | null,
		) => ResultAsync<CursorPagedResponse<T[], TCursor>, TError>,
		handler: (data: T[]) => ResultAsync<void, TError>,
	): ResultAsync<void, TError> {
		// Do the first read
		return ObjectUtils.processNextBatch(null, readFunc, handler).map(
			() => {},
		);
	}

	private static processNextBatch<T, TCursor, TError>(
		cursor: TCursor | null,
		readFunc: (
			cursor: TCursor | null,
		) => ResultAsync<CursorPagedResponse<T[], TCursor>, TError>,
		handler: (data: T[]) => ResultAsync<void, TError>,
	): ResultAsync<CursorPagedResponse<T[], TCursor>, TError> {
		return readFunc(cursor).andThen((resp) => {
			if (resp.response.length == 0) {
				return okAsync(resp);
			}

			return handler(resp.response).andThen(() => {
				return ObjectUtils.processNextBatch(
					resp.cursor,
					readFunc,
					handler,
				);
			});
		});
	}
}
