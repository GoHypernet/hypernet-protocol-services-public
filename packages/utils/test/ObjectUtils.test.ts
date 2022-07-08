import { CursorPagedResponse } from "@hypernetlabs/hypernet.id-objects";
import { okAsync } from "neverthrow";

import { ObjectUtils } from "@utils/ObjectUtils";

// class EthereumRepositoryMocks {
// 	public blockchainProvider: BlockchainProviderMock;
// 	public configProvider = new ConfigProviderMock();

// 	constructor(blockchainErrors = false) {
// 		this.blockchainProvider = new BlockchainProviderMock(blockchainErrors);
// 	}

// 	public factoryRepository(): IEthereumRepository {
// 		return new EthereumRepository(
// 			this.blockchainProvider,
// 			this.configProvider,
// 		);
// 	}
// }

describe("ObjectUtils tests", () => {
	test("iterateCursor runs over all data", async () => {
		// Arrange
		let batch1 = false;
		let batch2 = false;
		let batch3 = false;

		const readFunc = (cursor: number | null) => {
			if (cursor == null) {
				return okAsync(new CursorPagedResponse(["1", "2", "3"], 3, 3));
			}
			if (cursor == 3) {
				return okAsync(new CursorPagedResponse(["4", "5", "6"], 6, 3));
			}
			if (cursor == 6) {
				return okAsync(new CursorPagedResponse(["7", "8", "9"], 9, 3));
			}
			// Should be cursor = 9
			return okAsync(new CursorPagedResponse([], 9, 3));
		};

		const handler = (data: string[]) => {
			if (data.length == 0) {
				throw new Error("Handler called for empty set!");
			}

			if (data[0] == "1") {
				batch1 = true;
			}
			if (data[0] == "4") {
				batch2 = true;
			}
			if (data[0] == "7") {
				batch3 = true;
			}

			return okAsync(undefined);
		};

		// Act
		const result = await ObjectUtils.iterateCursor(readFunc, handler);

		// Assert
		expect(result).toBeDefined();
		expect(result.isErr()).toBeFalsy();
		expect(batch1).toBe(true);
		expect(batch2).toBe(true);
		expect(batch3).toBe(true);
	});
});
