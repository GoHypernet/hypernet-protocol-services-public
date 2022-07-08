import { UnixTimestamp, UUID } from "@hypernetlabs/objects";
import {
	getSchema,
	Schema,
	UUID as SchemaUUID,
	String,
	Nested,
	Number,
} from "fastest-validator-decorators";

@Schema()
export class Passport {
	public constructor(
		public id: UUID,
		public identityId: UUID,
		public passportId: string,
		public expirationDate: UnixTimestamp,
		public imageUrl: string | null,
	) {}
}
