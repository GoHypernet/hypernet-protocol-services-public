import { UUID } from "@hypernetlabs/objects";

export class CursorPagingRequest<TCursor = UUID> {
	public constructor(
		public cursor: TCursor | null,
		public pageSize: number = 20,
	) {}
}
