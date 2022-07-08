import { EService } from "@hypernetlabs/hypernet.id-objects";
import { ChainId, EthereumContractAddress } from "@hypernetlabs/objects";

export class ChainInfo {
	public constructor(
		public chainId: ChainId,
		public service: EService,
		public identityRegistryAddress: EthereumContractAddress,
		public profileRegistryAddress: EthereumContractAddress,
		public registryFactoryAddress: EthereumContractAddress,
		public hypertokenAddress: EthereumContractAddress | null,
		public displayName: string,
		public symbol: string,
		public specialGasHandling: boolean,
	) {}
}

export const chainInfo = [
	new ChainInfo(
		ChainId(4),
		EService.Rinkeby,
		EthereumContractAddress("0x8E92D1D990E36e00Af533db811Fc5C342823C817"),
		EthereumContractAddress("0x6c355Ad248477eeDcadf1d6724154C6152C0edca"),
		EthereumContractAddress("0x60eFCb4dDA1bef87aA244006273e3DdDb0E4abCB"),
		EthereumContractAddress("0x6D4eE7f794103672490830e15308A99eB7a89024"),
		"Rinkeby",
		"ETH",
		false,
	),
	new ChainInfo(
		ChainId(137),
		EService.Polygon,
		EthereumContractAddress("0x267F7bE23760743f0e415A28f56dA5129EA11AA9"),
		EthereumContractAddress("0x91AE7a63d375CE3869436c1bFE3F7c56ce70c3ad"),
		EthereumContractAddress("0xd93fbc9d330c5a1d242d01c0f10115483a062d7c"),
		null,
		"Polygon",
		"MATIC",
		true,
	),
	new ChainInfo(
		ChainId(1337),
		EService.TestChain,
		EthereumContractAddress("0xCdFa906b330485021fD37d5E3Ceab4F11D5101c6"),
		EthereumContractAddress("0x48005e7dDF065DE036Bf0D693DDb0011aE7a041c"),
		EthereumContractAddress("TODO"),
		EthereumContractAddress("0xAa588d3737B611baFD7bD713445b314BD453a5C8"),
		"TestChain",
		"testChain",
		false,
	),
	new ChainInfo(
		ChainId(1338),
		EService.TestChain2,
		EthereumContractAddress("0xCdFa906b330485021fD37d5E3Ceab4F11D5101c6"),
		EthereumContractAddress("0x48005e7dDF065DE036Bf0D693DDb0011aE7a041c"),
		EthereumContractAddress("TODO"),
		null,
		"TestChain2",
		"testChain2",
		false,
	),
	new ChainInfo(
		ChainId(43113),
		EService.Fuji,
		EthereumContractAddress("0x70f622E02b96c498c6266eA6C96327160A21263b"),
		EthereumContractAddress("0xf51499e303E6Af9895147a170C6b2Cd9e407a868"),
		EthereumContractAddress("0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"),
		null,
		"Fuji",
		"AVAX",
		false,
	),
	new ChainInfo(
		ChainId(43114),
		EService.Avalanche,
		EthereumContractAddress("0x70f622E02b96c498c6266eA6C96327160A21263b"),
		EthereumContractAddress("0xf51499e303E6Af9895147a170C6b2Cd9e407a868"),
		EthereumContractAddress("0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a"),
		null,
		"Avalanche",
		"AVAX",
		false,
	),
	new ChainInfo(
		ChainId(80001),
		EService.Mumbai,
		EthereumContractAddress("0x398c52D8599B78bB1CeAe56532DDBf683433EC3f"),
		EthereumContractAddress("0xa6C15b6950dfd9aB3FA3ba7fAb9F420e52B22f17"),
		EthereumContractAddress("0x6cd4a3319B5E2173Fb44e21B5b506da35ada9899"),
		null,
		"Mumbai",
		"MATIC",
		false,
	),
];

export function getChainInfoByChainId(chainId: ChainId): ChainInfo {
	const chain = chainInfo.find((val) => {
		return val.chainId == chainId;
	});

	if (chain != null) {
		return chain;
	}

	throw new Error(`Unknown Chain ID ${chainId}`);
}
