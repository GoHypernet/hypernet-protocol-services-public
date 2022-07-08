import {
	IRedisProvider,
	IRedisProviderType,
} from "@hypernetlabs/common-redis-provider";
import { RedisError } from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class ConcurrencyUtils {
	public constructor(
		@inject(IRedisProviderType) protected redisProvider: IRedisProvider,
	) {}

	public performWithLock<T, E>(
		lockName: string | string[],
		func: () => ResultAsync<T, E>,
		lockTime = 60000,
	): ResultAsync<T, RedisError | E> {
		return this.redisProvider.getRedisClient().andThen((redisClient) => {
			return redisClient
				.lock(lockName, lockTime)
				.mapErr((e) => {
					return new RedisError(
						`Unable to obtain lock ${lockName}`,
						e,
					);
				})
				.andThen((lock) => {
					return func()
						.andThen((val) => {
							return lock.unlock(val);
						})
						.mapErr((e) => {
							lock.unlock(e);
							return e;
						});
				});
		});
	}
}
