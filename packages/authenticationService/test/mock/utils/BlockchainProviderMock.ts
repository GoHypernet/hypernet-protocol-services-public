import {
	BlockchainUnavailableError,
	IdentityTokenContent,
} from "@hypernetlabs/hypernet.id-objects";
import { ethers } from "ethers";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { TokenUtils } from "@authentication/implementations/utils";
import {
	IBlockchainProvider,
	INonFungibleRegistryContract,
} from "@authentication/interfaces/utils";
import {
	accountAddress1,
	accountAddress2,
	token1Id,
	token2Id,
	unixNow,
} from "@mock/CommonValues";

export class BlockchainProviderMock implements IBlockchainProvider {
	public signer = td.object<ethers.providers.JsonRpcSigner>();
	public provider = td.object<ethers.providers.JsonRpcProvider>();
	public nonFungibleRegistryContract =
		td.object<INonFungibleRegistryContract>();

	// UnixNow, only LegalName
	public token1 = TokenUtils.createTokenContent(1, unixNow);

	// UnixNow, All Fields
	public token2 = TokenUtils.createTokenContent(127, unixNow);

	private factoryTransactionResponse() {
		const response = td.object<ethers.providers.TransactionResponse>();

		td.when(response.wait()).thenResolve(
			{} as ethers.providers.TransactionReceipt,
		);

		return response;
	}

	constructor(protected errorMode = false) {
		td.when(this.provider.listAccounts()).thenResolve([accountAddress1]);

		td.when(
			this.nonFungibleRegistryContract.register(
				accountAddress1,
				"", // label is blank, results in no label in token
				this.token1,
			),
		).thenResolve(this.factoryTransactionResponse());

		td.when(
			this.nonFungibleRegistryContract.register(
				accountAddress2,
				"", // label is blank, results in no label in token
				this.token2,
			),
		).thenResolve(this.factoryTransactionResponse());

		td.when(
			this.nonFungibleRegistryContract.tokenOfOwnerByIndex(
				accountAddress1,
				0,
			),
		).thenResolve(token1Id);

		td.when(
			this.nonFungibleRegistryContract.tokenOfOwnerByIndex(
				accountAddress2,
				0,
			),
		).thenResolve(token2Id);

		// Create the token URI; the second half is the timestamp, the first
		// is the flags
		td.when(
			this.nonFungibleRegistryContract.tokenURI(token1Id),
		).thenResolve(this.token1 as never);

		td.when(
			this.nonFungibleRegistryContract.tokenURI(token2Id),
		).thenResolve(this.token2 as never);
	}

	public getSigner(): ResultAsync<
		ethers.providers.JsonRpcSigner,
		BlockchainUnavailableError
	> {
		if (this.errorMode) {
			return errAsync(
				new BlockchainUnavailableError("getSigner Error", null),
			);
		}
		return okAsync(this.signer);
	}
	public getProvider(): ResultAsync<
		ethers.providers.JsonRpcProvider,
		BlockchainUnavailableError
	> {
		if (this.errorMode) {
			return errAsync(
				new BlockchainUnavailableError("getProvider Error", null),
			);
		}
		return okAsync(this.provider);
	}

	public getLatestBlock(): ResultAsync<
		ethers.providers.Block,
		BlockchainUnavailableError
	> {
		return okAsync({} as ethers.providers.Block);
	}

	public getNonFungibleRegistryContract(
		providerOrSigner: ethers.providers.JsonRpcProvider | ethers.Signer,
	): ResultAsync<INonFungibleRegistryContract, never> {
		return okAsync(this.nonFungibleRegistryContract);
	}
}
