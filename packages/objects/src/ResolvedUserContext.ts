import { JsonWebToken } from "@hypernetlabs/objects";

import { ResolvedToken } from "@objects/ResolvedToken";
import { UserContext } from "@objects/UserContext";

export class ResolvedUserContext extends UserContext {
	public constructor(
		requestId: string,
		parentId: string,
		userToken: JsonWebToken | null,
		serviceToken: JsonWebToken | null,
		delegationTokens: JsonWebToken[],
		public resolvedUserToken: ResolvedToken | null,
		public resolvedServiceToken: ResolvedToken | null,
		public resolvedDelegationTokens: ResolvedToken[],
	) {
		super(requestId, parentId, userToken, serviceToken, delegationTokens);
	}
}
