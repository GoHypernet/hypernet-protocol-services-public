import {
	Birthday,
	EmailAddress,
	GovernmentId,
	LegalName,
	Passport,
	PhysicalAddress,
} from "@hypernetlabs/hypernet.id-objects";
import { EthereumAddress, UnixTimestamp, UUID } from "@hypernetlabs/objects";
import { ethers } from "ethers";

export const unixNow = UnixTimestamp(1318874398);
export const accountAddress1 = EthereumAddress("AccountAddress1");
export const accountAddress2 = EthereumAddress("AccountAddress2");
export const privateKey = "PrivateKey";
export const blockchainRPCProviderUrl = "blockchainRPCProviderUrl";
export const registryAddress = EthereumAddress("registryAddress");
export const token1Id = ethers.BigNumber.from(1);
export const token2Id = ethers.BigNumber.from(2);
export const identityId1 = UUID("Identity1");
export const legalNameId1 = UUID("LegalName1");
export const emailAddressId1 = UUID("Email1");
export const passpordId1 = UUID("Passport1");
export const governmentIdId1 = UUID("GovernmentId1");
export const birthdayId1 = UUID("Birthday1");
export const physicalAddressId1 = UUID("PhysicalAddress1");

export const legalName1 = new LegalName(
	legalNameId1,
	"Phoebe",
	"Sibbach",
	"Yuriko",
	"Beep",
	'Phoebe Yuriko "Beep" Sibbach',
	unixNow,
);

export const emailAddress1 = new EmailAddress(
	emailAddressId1,
	identityId1,
	"email@address.com",
	true,
);

export const passport1 = new Passport(
	passpordId1,
	identityId1,
	"Passport ID Num",
	unixNow,
	null,
);

export const governmentId1 = new GovernmentId(
	governmentIdId1,
	identityId1,
	"Government ID Num",
	unixNow,
	null,
);

export const birthday1 = new Birthday(birthdayId1, identityId1, unixNow);

export const physicalAddress1 = new PhysicalAddress(
	physicalAddressId1,
	identityId1,
	"2730 Broadway",
	null,
	null,
	"Redwood City",
	"94062",
	"CA",
	"US",
);
