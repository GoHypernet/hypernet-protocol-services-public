import {
	IdentityMetadata,
	MintedIdentityToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	CountryCode,
	EmailAddressString,
	EthereumAccountAddress,
	UnixTimestamp,
} from "@hypernetlabs/objects";

import { PIIDocument } from "@objects/documents/PIIDocument";
import { IdentityId } from "@objects/IdentityId";
import { ScreeningLink } from "@objects/ScreeningLink";
import { ScreeningResults } from "@objects/ScreeningResults";
import { UsernameString } from "@objects/UsernameString";
import { VerificationId } from "@objects/VerificationId";
import { VersionId } from "@objects/VersionId";

export class IdentityDoc extends PIIDocument {
	public constructor(
		versionId: VersionId,
		identityId: IdentityId,
		timestamp: UnixTimestamp,
		public accountAddresses: EthereumAccountAddress[],
		public countryCode: CountryCode,
		public email: EmailAddressString | null,
		public emailVerified: boolean,
		public username: UsernameString | null,
		public verificationId: VerificationId | null,
		public identityVerified: boolean,
		public verificationPending: boolean,
		public screeningLink: ScreeningLink | null,
		public screeningResults: ScreeningResults | null,
		public verifiedInvestor: boolean,
		public underSanctions: boolean,
		public activeSanctionsChecks: boolean,
		public identityMetadata: IdentityMetadata,
		public isAdmin: boolean,
	) {
		super(versionId, identityId, timestamp);
	}

	public mintedTokens: MintedIdentityToken[] = [];
}
