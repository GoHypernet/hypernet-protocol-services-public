import { UUID } from "@hypernetlabs/objects";
import { RegistryToken } from "@objects/RegistryToken";
import { BaseEvent } from "@objects/events/BaseEvent";
import { UserContext } from "@objects/UserContext";

export class RegistryTokenMintedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public tokenIdentifier: UUID,
		public mintedToken: RegistryToken,
	) {
		super(userContext);
	}

	static eventName = "OnRegistryTokenMinted";
}
