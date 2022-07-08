import hash from "object-hash";
import td from "testdouble";

class SecureServiceMocks {
	// public blockchainProvider: BlockchainProviderMock;
	// public configProvider = new ConfigProviderMock();
	// constructor(blockchainErrors = false) {
	// 	this.blockchainProvider = new BlockchainProviderMock(blockchainErrors);
	// }
	// public factoryRepository(): IEthereumRepository {
	// 	return new EthereumRepository(
	// 		this.blockchainProvider,
	// 		this.configProvider,
	// 	);
	// }
}

describe("SecureService tests", () => {
	// test("getIdentityTokenByAccount returns an identity token", async () => {
	// 	// Arrange
	// 	const mocks = new EthereumRepositoryMocks();

	// 	const repo = mocks.factoryRepository();

	// 	// Act
	// 	const result = await repo.getIdentityTokenByAccount(accountAddress1);

	// 	// Assert
	// 	expect(result).toBeDefined();
	// 	expect(result.isErr()).toBeFalsy();
	// 	const identityToken = result._unsafeUnwrap();
	// 	expect(identityToken.ownerAddress).toBe(accountAddress1);
	// 	expect(identityToken.legalName).toBeTruthy();
	// 	expect(identityToken.email).toBeFalsy();
	// 	expect(identityToken.passport).toBeFalsy();
	// 	expect(identityToken.governmentId).toBeFalsy();
	// 	expect(identityToken.birthday).toBeFalsy();
	// 	expect(identityToken.residenceAddress).toBeFalsy();
	// 	expect(identityToken.mailingAddress).toBeFalsy();
	// 	expect(identityToken.timestamp).toBe(unixNow);
	// 	expect(identityToken.tokenId).toBe(
	// 		BigNumberString(token1Id.toString()),
	// 	);
	// });

	test("hash tests", async () => {
		// Arrange

		// Act
		const scalarHash = hash(1);
		const nullHash = hash(null);
		const nullHash2 = hash(null);
		const objectHash = hash({ success: true });

		// Assert
		expect(scalarHash).toBe("7b343448ed87b254b79eba27bc18c21b2f985f0c");
		expect(nullHash).toBe("109085beaaa80ac89858b283a64f7c75d7e5bb12");
		expect(nullHash2).toBe("109085beaaa80ac89858b283a64f7c75d7e5bb12");
		expect(objectHash).toBe("e89974554ad5377d7a1f9b0064a5da89790f6275");
		expect(() => hash(undefined as unknown as null)).toThrow();
	});
});
