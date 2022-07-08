import { avalancheModule } from "@avalanche/implementations/modules";
import {
	ChainService,
	chainModule,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import {
	encryptionModule,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ChainId } from "@hypernetlabs/objects";
import { ContainerModule } from "inversify";

export default class AvalancheService extends ChainService {
	public getChainId(): ChainId {
		return ChainId(43114);
	}

	public modules(): ContainerModule[] {
		return [avalancheModule, chainModule, encryptionModule, securityModule];
	}
}
