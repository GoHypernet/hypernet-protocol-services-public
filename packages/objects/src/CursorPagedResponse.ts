import { UUID } from "@hypernetlabs/objects";

export class CursorPagedResponse<T, TCursor = UUID> {
	public constructor(
		public response: T,
		public cursor: TCursor,
		public pageSize: number,
	) {}
}
