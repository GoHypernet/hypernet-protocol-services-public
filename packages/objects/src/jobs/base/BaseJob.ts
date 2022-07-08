import { UserContext } from "@objects/UserContext";

export abstract class BaseJob {
	constructor(public userContext: UserContext) {}

	public abstract getQueueName(): string;
}
