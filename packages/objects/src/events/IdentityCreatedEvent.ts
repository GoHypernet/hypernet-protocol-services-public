import { EthereumAccountAddress } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { ReferralLinkId } from "@objects/ReferralLinkId";
import { Nonce } from "@objects/Nonce";
import { UserContext } from "@objects/UserContext";
import { UsernameString } from "@objects/UsernameString";

export class IdentityCreatedEvent extends BaseEvent {
	public constructor(
		public userContext: UserContext,
		public identityId: IdentityId,
		public firstAccountAddress: EthereumAccountAddress,
		public username: UsernameString | null,
		public referralLinkId: ReferralLinkId | null,
		public nftNonce: Nonce | null,
	) {
		super(userContext);
	}

	static eventName = "OnIdentityCreated";
}
