import { SHA256Hash } from "@hypernetlabs/common-objects";
import { EmailAddressString } from "@hypernetlabs/objects";

import { BaseEvent } from "@objects/events/BaseEvent";
import { IdentityId } from "@objects/IdentityId";
import { Nonce } from "@objects/Nonce";
import { UserContext } from "@objects/UserContext";

export class EmailAddedEvent extends BaseEvent {
	public constructor(
		userContext: UserContext,
		public identityId: IdentityId,
		public email: EmailAddressString, // TODO: This should be an EncryptedString or EncryptedData
		public emailHash: SHA256Hash,
		public verificationNonce: Nonce | null,
		public otp: string | null,
	) {
		super(userContext);
	}

	static eventName = "OnEmailAdded";
}
