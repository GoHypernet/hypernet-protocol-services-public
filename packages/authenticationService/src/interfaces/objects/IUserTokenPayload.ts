import {
	CorporateId,
	ECorporateRole,
	EService,
	IdentityId,
} from "@hypernetlabs/hypernet.id-objects";
import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { JwtPayload } from "jsonwebtoken";

export interface IUserTokenPayload extends JwtPayload {
	accountAddress: EthereumAccountAddress | null;
	identityId: IdentityId | null;
	service: EService | null;
	corporateId: CorporateId | null;
	gty: string | null;
	azp: string | null;
	permissions: string[] | null;
	corporatePermissions: { [key: CorporateId]: ECorporateRole };
}
