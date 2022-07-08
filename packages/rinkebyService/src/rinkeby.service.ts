import {
	ChainService,
	chainModule,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import {
	encryptionModule,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ChainId } from "@hypernetlabs/objects";
import { rinkebyModule } from "@rinkeby/implementations/modules";
import { ContainerModule } from "inversify";

export default class RinkebyService extends ChainService {
	public getChainId(): ChainId {
		return ChainId(4);
	}

	public modules(): ContainerModule[] {
		return [rinkebyModule, chainModule, encryptionModule, securityModule];
	}
}
