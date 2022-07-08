import { ContainerModule, interfaces } from "inversify";

import {
	IIPFSServiceRepository,
	IIPFSServiceRepositoryType,
} from "@ipfsContracts/IIPFSServiceRepository";
import { IPFSServiceRepository } from "@ipfsContracts/IPFSServiceRepository";

export const ipfsModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IIPFSServiceRepository>(IIPFSServiceRepositoryType)
			.to(IPFSServiceRepository)
			.inSingletonScope();
	},
);
