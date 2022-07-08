import { UserContext } from "@objects/UserContext";

export class ContextMeta {
	public constructor(
		public authenticated: boolean,
		public user: UserContext | null,
		public $responseHeaders?: { [key: string]: string },
	) {}
}
