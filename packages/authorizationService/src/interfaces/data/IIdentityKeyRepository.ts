import { IdentityKey, NewIdentityKey } from "@authorization/interfaces/objects";
import { DatabaseError, IdentityId } from "@hypernetlabs/hypernet.id-objects";
import { UUID } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIdentityKeyRepository {
	getByIdentityId(
		identityId: IdentityId,
	): ResultAsync<IdentityKey | null, DatabaseError>;
	create(
		newCampaign: NewIdentityKey,
	): ResultAsync<IdentityKey, DatabaseError>;
}

export const IIdentityKeyRepositoryType = Symbol.for("IIdentityKeyRepository");
