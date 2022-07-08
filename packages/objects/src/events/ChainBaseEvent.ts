import { ChainId } from "@hypernetlabs/objects";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class ChainBaseEvent extends BaseEvent {
	public constructor(userContext: UserContext, public chainId: ChainId) {
		super(userContext);
	}
}
