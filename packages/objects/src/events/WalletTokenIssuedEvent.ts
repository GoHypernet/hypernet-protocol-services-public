import { EthereumAccountAddress } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { UserContext } from "@objects/UserContext";

export class WalletTokenIssuedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public accountAddress: EthereumAccountAddress,
	) {
		super(userContext);
	}

	static eventName = "OnWalletTokenIssued";
}
