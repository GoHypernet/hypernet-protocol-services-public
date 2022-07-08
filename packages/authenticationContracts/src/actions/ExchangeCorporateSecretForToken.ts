import {
	CorporateId,
	EService,
	Nonce,
} from "@hypernetlabs/hypernet.id-objects";

export class ExchangeCorporateSecretForToken {
	public constructor(
		public corporateId: CorporateId,
		public corporateSecret: Nonce,
	) {}

	static actionName = "exchangeCorporateSecretForToken";
	static fullActionName = `${EService.Authentication}.${ExchangeCorporateSecretForToken.actionName}`;
}
