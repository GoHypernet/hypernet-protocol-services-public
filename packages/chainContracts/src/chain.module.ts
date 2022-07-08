import { ContainerModule, interfaces } from "inversify";

import { ChainServiceRepository } from "@chainContracts/ChainServiceRepository";
import {
	IChainServiceRepository,
	IChainServiceRepositoryType,
} from "@collectionContracts/IChainServiceRepository";

export const chainModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IChainServiceRepository>(IChainServiceRepositoryType)
			.to(ChainServiceRepository)
			.inSingletonScope();
	},
);
