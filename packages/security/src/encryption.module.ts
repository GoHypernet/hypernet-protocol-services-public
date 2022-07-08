import { ContainerModule, interfaces } from "inversify";

import { EncryptionUtils } from "@security/EncryptionUtils";
import {
	IEncryptionUtils,
	IEncryptionUtilsType,
} from "@security/IEncryptionUtils";

export const encryptionModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IEncryptionUtils>(IEncryptionUtilsType)
			.to(EncryptionUtils)
			.inSingletonScope();
	},
);
