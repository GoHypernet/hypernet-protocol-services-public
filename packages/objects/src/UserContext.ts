import { JsonWebToken } from "@hypernetlabs/objects";

export class UserContext {
	public constructor(
		public requestId: string,
		public parentId: string,
		public userToken: JsonWebToken | null,
		public serviceToken: JsonWebToken | null,
		public delegationTokens: JsonWebToken[],
	) {}
}
