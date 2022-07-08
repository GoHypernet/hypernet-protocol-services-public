import {
	ChainService,
	chainModule,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import {
	encryptionModule,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ChainId } from "@hypernetlabs/objects";
import { mumbaiModule } from "@mumbai/implementations/modules";
import { ContainerModule } from "inversify";

export default class MumbaiService extends ChainService {
	public getChainId(): ChainId {
		return ChainId(80001);
	}

	public modules(): ContainerModule[] {
		return [mumbaiModule, chainModule, encryptionModule, securityModule];
	}
}
