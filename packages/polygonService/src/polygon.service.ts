import {
	ChainService,
	chainModule,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import {
	encryptionModule,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ChainId } from "@hypernetlabs/objects";
import { polygonModule } from "@polygon/implementations/modules";
import { ContainerModule } from "inversify";

export default class PolygonService extends ChainService {
	public getChainId(): ChainId {
		return ChainId(137);
	}

	public modules(): ContainerModule[] {
		return [polygonModule, chainModule, encryptionModule, securityModule];
	}
}
