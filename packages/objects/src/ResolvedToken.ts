import { EthereumAccountAddress, JsonWebToken } from "@hypernetlabs/objects";

import { CorporateId } from "@objects/CorporateId";
import {
	EAuthenticationTokenType,
	ECorporateRole,
	EService,
} from "@objects/enum";
import { IdentityId } from "@objects/IdentityId";

export class ResolvedToken {
	public constructor(
		public tokenType: EAuthenticationTokenType,
		public token: JsonWebToken,
		public identityId: IdentityId | null,
		public accountAddress: EthereumAccountAddress | null,
		public auth0Id: string | null,
		public service: EService | null,
		public corporateId: CorporateId | null,
		public corporatePermissions: { [index: CorporateId]: ECorporateRole },
		public admin: boolean,
	) {}
}
