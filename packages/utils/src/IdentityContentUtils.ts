import {
	EIdentityFlags,
	IdentityMetadata,
	IdentityToken,
} from "@hypernetlabs/hypernet-id-objects";
import { IdentityTokenContent } from "@hypernetlabs/hypernet.id-objects";
import {
	ChainId,
	CountryCode,
	EthereumContractAddress,
	RegistryEntry,
	UnixTimestamp,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { LoggerInstance } from "moleculer";

export class IdentityContentUtils {
	static identityTokenToIdentityTokenContent(
		identityToken: IdentityToken,
	): IdentityTokenContent {
		return IdentityContentUtils.identityMetadataToIdentityTokenContent(
			identityToken,
			identityToken.countryCode,
			identityToken.timestamp,
		);
	}

	static identityMetadataToIdentityTokenContent(
		identityMetadata: IdentityMetadata,
		countryCode: CountryCode,
		timestamp: UnixTimestamp,
	): IdentityTokenContent {
		// Create the identity string. This is 16 bytes of binary, encoded as a 32 byte hex string
		let flags = 0;

		if (identityMetadata.email) {
			flags |= EIdentityFlags.Email;
		}

		if (identityMetadata.firstName) {
			flags |= EIdentityFlags.FirstName;
		}

		if (identityMetadata.lastName) {
			flags |= EIdentityFlags.LastName;
		}

		if (identityMetadata.birthday) {
			flags |= EIdentityFlags.DateOfBirth;
		}

		if (identityMetadata.placeOfBirth) {
			flags |= EIdentityFlags.PlaceOfBirth;
		}

		if (identityMetadata.mailingAddress) {
			flags |= EIdentityFlags.MailingAddress;
		}

		if (identityMetadata.residenceAddress) {
			flags |= EIdentityFlags.ResidenceAddress;
		}

		if (identityMetadata.passport) {
			flags |= EIdentityFlags.Passport;
		}

		if (identityMetadata.drivingLicense) {
			flags |= EIdentityFlags.DrivingLicense;
		}

		if (identityMetadata.visa) {
			flags |= EIdentityFlags.Visa;
		}

		if (identityMetadata.nationalId) {
			flags |= EIdentityFlags.NationalId;
		}

		if (identityMetadata.consularId) {
			flags |= EIdentityFlags.ConsularId;
		}

		if (identityMetadata.electoralId) {
			flags |= EIdentityFlags.ElectoralId;
		}

		if (identityMetadata.residentPermitId) {
			flags |= EIdentityFlags.ResidentPermitId;
		}

		if (identityMetadata.taxId) {
			flags |= EIdentityFlags.TaxId;
		}

		if (identityMetadata.studentId) {
			flags |= EIdentityFlags.StudenId;
		}

		if (identityMetadata.passportCard) {
			flags |= EIdentityFlags.PassportCard;
		}

		if (identityMetadata.militaryId) {
			flags |= EIdentityFlags.MilitaryId;
		}

		if (identityMetadata.publicSafetyId) {
			flags |= EIdentityFlags.PublicSafetyId;
		}

		if (identityMetadata.healthId) {
			flags |= EIdentityFlags.HealthId;
		}

		if (identityMetadata.taxEssentials) {
			flags |= EIdentityFlags.TaxEssentials;
		}

		if (identityMetadata.socialSecurityNumber) {
			flags |= EIdentityFlags.SocialSecurityNumber;
		}

		if (identityMetadata.taxNumber) {
			flags |= EIdentityFlags.TaxNumber;
		}

		if (identityMetadata.naturalPersonsRegister) {
			flags |= EIdentityFlags.NaturalPersonsRegister;
		}

		if (identityMetadata.generalRegistrationNumber) {
			flags |= EIdentityFlags.GeneralRegistrationNumber;
		}

		if (identityMetadata.voterIdNumber) {
			flags |= EIdentityFlags.VoterIdNumber;
		}

		if (identityMetadata.issuingNumber) {
			flags |= EIdentityFlags.IssuingNumber;
		}

		if (identityMetadata.gender) {
			flags |= EIdentityFlags.Gender;
		}

		if (identityMetadata.nationality) {
			flags |= EIdentityFlags.Nationality;
		}

		if (identityMetadata.livenessImage) {
			flags |= EIdentityFlags.LivenessImage;
		}

		if (identityMetadata.motherName) {
			flags |= EIdentityFlags.MotherName;
		}

		if (identityMetadata.fatherName) {
			flags |= EIdentityFlags.FatherName;
		}

		if (identityMetadata.verifiedInvestor) {
			flags |= EIdentityFlags.VerifiedInvestor;
		}

		if (identityMetadata.underSanctions) {
			flags |= EIdentityFlags.UnderSanctions;
		}

		if (identityMetadata.activeScreening) {
			flags |= EIdentityFlags.ActiveScreening;
		}

		const tokenString = IdentityContentUtils.createTokenContent(
			flags,
			countryCode,
			timestamp,
		);

		return tokenString;
	}

	static createTokenContent(
		flags: number,
		countryCode: CountryCode,
		timestamp: UnixTimestamp,
	): IdentityTokenContent {
		// Create the 16 byte buffer
		const arrayBuffer = new ArrayBuffer(16);

		// Wrap it in a data view
		const view = new DataView(arrayBuffer);

		// Set the first half with the flags
		view.setBigUint64(0, BigInt(flags));

		// Set the second half with the timestamp
		view.setBigUint64(8, BigInt(timestamp));

		// Set the countryCode
		view.setInt16(8, countryCode);

		// Convert to a hex string
		const hexstring = ethers.utils.hexlify(new Uint8Array(arrayBuffer));

		// strip the leading 0x
		const noLead = hexstring.slice(2);

		return IdentityTokenContent(noLead);
	}

	static identityTokenContentToIdentityMetadata(
		content: IdentityTokenContent,
	): IdentityMetadata {
		const hexstring = `0x${content}`;
		if (!this.validateTokenHexString(content)) {
			return new IdentityMetadata(
				UnixTimestamp(0),
				CountryCode(0),
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			);
		}
		// Convert to binary data
		const binary = ethers.utils.arrayify(hexstring).buffer;

		// Load it into a data view
		const view = new DataView(binary);

		// Flags1 is the lower portion of the data
		const flags1 = view.getInt32(4);

		// Flags2 is the upper portion, starting at FatherName
		// TODO: EIdentityFlags does not work here!
		// We need an EIdentityFlagsHigh
		const flags2 = view.getInt32(0);

		const countryCode = view.getInt16(8);
		const timestampBigPart = view.getUint16(10);
		const timestampSmallPart = view.getUint32(12);
		const timestamp = timestampSmallPart + (timestampBigPart << 32);

		return new IdentityMetadata(
			UnixTimestamp(timestamp),
			CountryCode(countryCode),
			(flags1 & EIdentityFlags.Email) > 0,
			(flags1 & EIdentityFlags.FirstName) > 0,
			(flags1 & EIdentityFlags.LastName) > 0,
			(flags1 & EIdentityFlags.DateOfBirth) > 0,
			(flags1 & EIdentityFlags.PlaceOfBirth) > 0,
			(flags1 & EIdentityFlags.MailingAddress) > 0,
			(flags1 & EIdentityFlags.ResidenceAddress) > 0,
			(flags1 & EIdentityFlags.Passport) > 0,
			(flags1 & EIdentityFlags.DrivingLicense) > 0,
			(flags1 & EIdentityFlags.Visa) > 0,
			(flags1 & EIdentityFlags.NationalId) > 0,
			(flags1 & EIdentityFlags.ConsularId) > 0,
			(flags1 & EIdentityFlags.ElectoralId) > 0,
			(flags1 & EIdentityFlags.ResidentPermitId) > 0,
			(flags1 & EIdentityFlags.TaxId) > 0,
			(flags1 & EIdentityFlags.StudenId) > 0,
			(flags1 & EIdentityFlags.PassportCard) > 0,
			(flags1 & EIdentityFlags.MilitaryId) > 0,
			(flags1 & EIdentityFlags.PublicSafetyId) > 0,
			(flags1 & EIdentityFlags.HealthId) > 0,
			(flags1 & EIdentityFlags.TaxEssentials) > 0,
			(flags1 & EIdentityFlags.SocialSecurityNumber) > 0,
			(flags1 & EIdentityFlags.TaxNumber) > 0,
			(flags1 & EIdentityFlags.NaturalPersonsRegister) > 0,
			(flags1 & EIdentityFlags.GeneralRegistrationNumber) > 0,
			(flags1 & EIdentityFlags.VoterIdNumber) > 0,
			(flags1 & EIdentityFlags.IssuingNumber) > 0,
			(flags1 & EIdentityFlags.Gender) > 0,
			(flags1 & EIdentityFlags.Nationality) > 0,
			(flags1 & EIdentityFlags.LivenessImage) > 0,
			(flags1 & EIdentityFlags.MotherName) > 0,

			(flags2 & EIdentityFlags.FatherName) > 0,
			(flags2 & EIdentityFlags.VerifiedInvestor) > 0,
			(flags2 & EIdentityFlags.UnderSanctions) > 0,
			(flags2 & EIdentityFlags.ActiveScreening) > 0,
		);
	}

	static validateTokenHexString(tokenString: string): boolean {
		const re = /^[0-9A-Fa-f]{32}$/g;

		return re.test(tokenString);
	}
}
