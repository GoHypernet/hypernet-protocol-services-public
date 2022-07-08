/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BaseJob,
	ResolvedUserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { interfaces } from "inversify";
import { ResultAsync } from "neverthrow";

export class JobProcessor<TJob extends BaseJob = any, TService = any> {
	public constructor(
		public queueName: string,
		public serviceIdentifier: interfaces.ServiceIdentifier<TService>,
		public handler: (
			job: TJob,
			userContext: ResolvedUserContext,
			service: TService,
		) => ResultAsync<void, unknown>,
	) {}
}
