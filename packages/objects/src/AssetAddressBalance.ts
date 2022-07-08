import {
	BigNumberString,
	EthereumContractAddress,
} from "@hypernetlabs/objects";

export class AssetAddressBalance {
	public constructor(
		public assetAddress: EthereumContractAddress,
		public balance: BigNumberString,
	) {}
}
