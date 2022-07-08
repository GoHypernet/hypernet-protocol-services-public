import { IdentityTokenContent } from "@hypernetlabs/hypernet.id-objects";
import { CountryCode, UnixTimestamp } from "@hypernetlabs/objects";

import { IdentityContentUtils } from "@utils/IdentityContentUtils";

describe("IdentityContentUtils tests", () => {
	test("validateTokenHexString works with valid data", async () => {
		// Arrange
		const hexstring = "0000000000000001000000006254cffe";

		// Act
		const result = IdentityContentUtils.validateTokenHexString(hexstring);

		// Assert
		expect(result).toBeTruthy();
	});

	test("validateTokenHexString rejects invalid data", async () => {
		// Arrange
		const hexstring = "000000G000000001000000006254cffe";

		// Act
		const result = IdentityContentUtils.validateTokenHexString(hexstring);

		// Assert
		expect(result).toBeFalsy();
	});

	test("validateTokenHexString rejects data that is too long", async () => {
		// Arrange
		const hexstring = "00000000000000001000000006254cffe";

		// Act
		const result = IdentityContentUtils.validateTokenHexString(hexstring);

		// Assert
		expect(result).toBeFalsy();
	});

	test("validateTokenHexString rejects prefixed hexstring", async () => {
		// Arrange
		const hexstring = "0x0000000000000001000000006254cffe";

		// Act
		const result = IdentityContentUtils.validateTokenHexString(hexstring);

		// Assert
		expect(result).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"0000000000000001000000006254cffe",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1649725438);
		expect(result.countryCode).toBe(0);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeFalsy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 2", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000000000000F000000006254cffe",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1649725438);
		expect(result.countryCode).toBe(0);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeTruthy();
		expect(result.lastName).toBeTruthy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 3", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"00000000FFFFFFFF000000006254cffe",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1649725438);
		expect(result.countryCode).toBe(0);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeTruthy();
		expect(result.lastName).toBeTruthy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeTruthy();
		expect(result.mailingAddress).toBeTruthy();
		expect(result.residenceAddress).toBeTruthy();
		expect(result.passport).toBeTruthy();
		expect(result.drivingLicense).toBeTruthy();
		expect(result.visa).toBeTruthy();
		expect(result.nationalId).toBeTruthy();
		expect(result.consularId).toBeTruthy();
		expect(result.electoralId).toBeTruthy();
		expect(result.residentPermitId).toBeTruthy();
		expect(result.taxId).toBeTruthy();
		expect(result.studentId).toBeTruthy();
		expect(result.passportCard).toBeTruthy();
		expect(result.militaryId).toBeTruthy();
		expect(result.publicSafetyId).toBeTruthy();
		expect(result.healthId).toBeTruthy();
		expect(result.taxEssentials).toBeTruthy();
		expect(result.socialSecurityNumber).toBeTruthy();
		expect(result.taxNumber).toBeTruthy();
		expect(result.naturalPersonsRegister).toBeTruthy();
		expect(result.generalRegistrationNumber).toBeTruthy();
		expect(result.voterIdNumber).toBeTruthy();
		expect(result.issuingNumber).toBeTruthy();
		expect(result.gender).toBeTruthy();
		expect(result.nationality).toBeTruthy();
		expect(result.livenessImage).toBeTruthy();
		expect(result.motherName).toBeTruthy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 4", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000000000000102f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeFalsy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 5", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000000800000d02f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeTruthy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeTruthy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 6", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000004000000102f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeFalsy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeTruthy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 7", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000002000000902f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeTruthy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 8", async () => {
		// Arrange

		//toBeTruthy fields
		//email -> 1
		//birthdate -> 8
		//nationality -> 268435456
		//liveness -> 536870912
		//Total -> 805306377 (decimal)
		//Hexadecimal -> 30000009 (decimal)
		// 0000000030000009-first 16 part

		const identityContent = IdentityTokenContent(
			"000000003000000902f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeTruthy();
		expect(result.livenessImage).toBeTruthy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("identityTokenContentToIdentityMetadata works with valid data 9", async () => {
		// Arrange

		//toBeTruthy fields
		//email -> 1
		//birthdate -> 8
		//ResidenceAddress -> 64,
		//nationality -> 268435456
		//liveness -> 536870912
		//Total -> 805306441 (decimal)
		//Hexadecimal -> 30000049
		// 00000000330000049-first 16 part

		const identityContent = IdentityTokenContent(
			"000000003000004902f1000062a36945",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(1654876485);
		expect(result.countryCode).toBe(753);
		expect(result.email).toBeTruthy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeTruthy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeTruthy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeTruthy();
		expect(result.livenessImage).toBeTruthy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});

	test("createTokenContent works with valid data 1", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000000000000102f1000062a36945",
		);
		// Act

		// 134217728 Gender
		// 1 email
		// 4 last name
		// 8 date of birth
		const result = await IdentityContentUtils.createTokenContent(
			1,
			CountryCode(753),
			UnixTimestamp(1654876485),
		);

		// Assert
		expect(result).toBe(identityContent);
	});

	test("createTokenContent works with valid data 2", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"000000000800000d02f1000062a36945",
		);

		// Act
		const result = await IdentityContentUtils.createTokenContent(
			134217741,
			CountryCode(753),
			UnixTimestamp(1654876485),
		);

		// Assert
		expect(result).toBe(identityContent);
	});

	test("identityTokenContentToIdentityMetadata works with invalid data", async () => {
		// Arrange
		const identityContent = IdentityTokenContent(
			"00000000G0000001000000006254cffe",
		);

		// Act
		const result =
			await IdentityContentUtils.identityTokenContentToIdentityMetadata(
				identityContent,
			);

		// Assert
		expect(result.timestamp).toBe(0);
		expect(result.countryCode).toBe(0);
		expect(result.email).toBeFalsy();
		expect(result.firstName).toBeFalsy();
		expect(result.lastName).toBeFalsy();
		expect(result.birthday).toBeFalsy();
		expect(result.placeOfBirth).toBeFalsy();
		expect(result.mailingAddress).toBeFalsy();
		expect(result.residenceAddress).toBeFalsy();
		expect(result.passport).toBeFalsy();
		expect(result.drivingLicense).toBeFalsy();
		expect(result.visa).toBeFalsy();
		expect(result.nationalId).toBeFalsy();
		expect(result.consularId).toBeFalsy();
		expect(result.electoralId).toBeFalsy();
		expect(result.residentPermitId).toBeFalsy();
		expect(result.taxId).toBeFalsy();
		expect(result.studentId).toBeFalsy();
		expect(result.passportCard).toBeFalsy();
		expect(result.militaryId).toBeFalsy();
		expect(result.publicSafetyId).toBeFalsy();
		expect(result.healthId).toBeFalsy();
		expect(result.taxEssentials).toBeFalsy();
		expect(result.socialSecurityNumber).toBeFalsy();
		expect(result.taxNumber).toBeFalsy();
		expect(result.naturalPersonsRegister).toBeFalsy();
		expect(result.generalRegistrationNumber).toBeFalsy();
		expect(result.voterIdNumber).toBeFalsy();
		expect(result.issuingNumber).toBeFalsy();
		expect(result.gender).toBeFalsy();
		expect(result.nationality).toBeFalsy();
		expect(result.livenessImage).toBeFalsy();
		expect(result.motherName).toBeFalsy();
		expect(result.fatherName).toBeFalsy();
		expect(result.verifiedInvestor).toBeFalsy();
		expect(result.underSanctions).toBeFalsy();
		expect(result.activeScreening).toBeFalsy();
	});
});
