import {
	BlockchainUnavailableError,
	EthereumReadError,
	EthereumWriteError,
	IdentityDoc,
	InvalidIdentityTokenError,
} from "@hypernetlabs/hypernet.id-objects";
import { BigNumberString } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { LoggerInstance } from "moleculer";
import td from "testdouble";

import { EthereumRepository } from "@authentication/implementations/data";
import { IEthereumRepository } from "@authentication/interfaces/data";
import {
	accountAddress1,
	accountAddress2,
	birthday1,
	emailAddress1,
	governmentId1,
	identityId1,
	legalName1,
	passport1,
	physicalAddress1,
	token1Id,
	token2Id,
	unixNow,
} from "@mock/CommonValues";
import { BlockchainProviderMock, ConfigProviderMock } from "@mock/utils";

class EthereumRepositoryMocks {
	public blockchainProvider: BlockchainProviderMock;
	public configProvider = new ConfigProviderMock();
	public loggerInstance = td.object<LoggerInstance>();

	constructor(blockchainErrors = false) {
		this.blockchainProvider = new BlockchainProviderMock(blockchainErrors);
	}

	public factoryRepository(): IEthereumRepository {
		return new EthereumRepository(
			this.blockchainProvider,
			this.configProvider,
			this.loggerInstance,
		);
	}
}

describe("EthereumRepository tests", () => {
	test("getIdentityTokenByAccount returns an identity token", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeFalsy();
		const identityToken = result._unsafeUnwrap();
		expect(identityToken.ownerAddress).toBe(accountAddress1);
		expect(identityToken.legalName).toBeTruthy();
		expect(identityToken.email).toBeFalsy();
		expect(identityToken.passport).toBeFalsy();
		expect(identityToken.governmentId).toBeFalsy();
		expect(identityToken.birthday).toBeFalsy();
		expect(identityToken.residenceAddress).toBeFalsy();
		expect(identityToken.mailingAddress).toBeFalsy();
		expect(identityToken.timestamp).toBe(unixNow);
		expect(identityToken.tokenId).toBe(
			BigNumberString(token1Id.toString()),
		);
	});

	test("getIdentityTokenByAccount returns an error if the blockchain provider fails", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks(true);

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(BlockchainUnavailableError);
	});

	test("getIdentityTokenByAccount returns an error if tokenOfOwnerByIndex fails", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.tokenOfOwnerByIndex(
				accountAddress1,
				0,
			),
		).thenReject(new Error());

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(EthereumReadError);
	});

	test("getIdentityTokenByAccount returns an error if tokenURI fails", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.tokenURI(
				token1Id,
			),
		).thenReject(new Error());

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(EthereumReadError);
	});

	test("getIdentityTokenByAccount returns an error if token content is not a hex string", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.tokenURI(
				token1Id,
			),
		).thenResolve("0000000000000000000000000000000G" as never);

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(InvalidIdentityTokenError);
	});

	test("getIdentityTokenByAccount returns an error if token content is the wrong length", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.tokenURI(
				token1Id,
			),
		).thenResolve("10000000000000000000000000000000011" as never);

		const repo = mocks.factoryRepository();

		// Act
		const result = await repo.getIdentityTokenByAccount(accountAddress1);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(InvalidIdentityTokenError);
	});

	test("mintIdentityToken succeeds and returns an identity token", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		const repo = mocks.factoryRepository();

		const identity = new IdentityDoc(
			identityId1,
			accountAddress1,
			null,
			legalName1,
			null,
			null,
			null,
			null,
			null,
			null,
			unixNow,
		);

		// Act
		const result = await repo.mintIdentityToken(identity);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeFalsy();
		const identityToken = result._unsafeUnwrap();
		expect(identityToken.ownerAddress).toBe(accountAddress1);
		expect(identityToken.legalName).toBeTruthy();
		expect(identityToken.email).toBeFalsy();
		expect(identityToken.passport).toBeFalsy();
		expect(identityToken.governmentId).toBeFalsy();
		expect(identityToken.birthday).toBeFalsy();
		expect(identityToken.residenceAddress).toBeFalsy();
		expect(identityToken.mailingAddress).toBeFalsy();
		expect(identityToken.timestamp).toBe(unixNow);
		expect(identityToken.tokenId).toBe(
			BigNumberString(token1Id.toString()),
		);
	});

	test("mintIdentityToken succeeds and returns a fully loaded identity token", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		const repo = mocks.factoryRepository();

		const identity = new IdentityDoc(
			identityId1,
			accountAddress2,
			null,
			legalName1,
			emailAddress1,
			passport1,
			governmentId1,
			birthday1,
			physicalAddress1,
			physicalAddress1,
			unixNow,
		);

		// Act
		const result = await repo.mintIdentityToken(identity);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeFalsy();
		const identityToken = result._unsafeUnwrap();
		expect(identityToken.ownerAddress).toBe(accountAddress2);
		expect(identityToken.legalName).toBeTruthy();
		expect(identityToken.email).toBeTruthy();
		expect(identityToken.passport).toBeTruthy();
		expect(identityToken.governmentId).toBeTruthy();
		expect(identityToken.birthday).toBeTruthy();
		expect(identityToken.residenceAddress).toBeTruthy();
		expect(identityToken.mailingAddress).toBeTruthy();
		expect(identityToken.timestamp).toBe(unixNow);
		expect(identityToken.tokenId).toBe(
			BigNumberString(token2Id.toString()),
		);
	});

	test("mintIdentityToken fails if register fails", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.register(
				accountAddress1,
				"", // label is blank, results in no label in token
				td.matchers.anything(),
			),
		).thenReject(new Error());

		const repo = mocks.factoryRepository();

		const identity = new IdentityDoc(
			identityId1,
			accountAddress1,
			null,
			legalName1,
			null,
			null,
			null,
			null,
			null,
			null,
			unixNow,
		);

		// Act
		const result = await repo.mintIdentityToken(identity);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(EthereumWriteError);
	});

	test("mintIdentityToken fails if wait fails", async () => {
		// Arrange
		const mocks = new EthereumRepositoryMocks();

		const response = td.object<ethers.providers.TransactionResponse>();

		td.when(response.wait()).thenReject(new Error());

		td.when(
			mocks.blockchainProvider.nonFungibleRegistryContract.register(
				accountAddress1,
				"", // label is blank, results in no label in token
				td.matchers.anything(),
			),
		).thenResolve(response);

		const repo = mocks.factoryRepository();

		const identity = new IdentityDoc(
			identityId1,
			accountAddress1,
			null,
			legalName1,
			null,
			null,
			null,
			null,
			null,
			null,
			unixNow,
		);

		// Act
		const result = await repo.mintIdentityToken(identity);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeTruthy();
		const error = result._unsafeUnwrapErr();
		expect(error).toBeInstanceOf(EthereumWriteError);
	});
});
