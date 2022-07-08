import { fujiModule } from "@fuji/implementations/modules";
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

export default class FujiService extends ChainService {
	public getChainId(): ChainId {
		return ChainId(43113);
	}

	public modules(): ContainerModule[] {
		return [fujiModule, chainModule, encryptionModule, securityModule];
	}
}
