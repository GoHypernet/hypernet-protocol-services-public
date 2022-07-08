import { EBackoffType } from "@queues/EBackoffType";

export class JobOptions {
	public constructor(
		public retries: number = 10,
		public backoffType: EBackoffType = EBackoffType.Exponential,
		public retryDelayMs: number = 1000,
	) {}
}

export class ScheduledJobOptions extends JobOptions {
	public constructor(
		public delayMs: number,
		retries?: number,
		backoffType?: EBackoffType,
		retryDelayMs?: number,
	) {
		super(retries, backoffType, retryDelayMs);
	}
}
