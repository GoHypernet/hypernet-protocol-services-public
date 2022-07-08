import { FujiConfigProvider } from "@fuji/implementations/utils";
import {
	IRedisConfigProvider,
	IRedisConfigProviderType,
} from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@hypernetlabs/hypernet.id-ethereum-chain-base";
import { ContainerModule, interfaces } from "inversify";
import {
	IEncryptionConfigProvider,
	IEncryptionConfigProviderType,
} from "@hypernetlabs/hypernet.id-security";

export const fujiModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IConfigProvider>(IConfigProviderType)
			.to(FujiConfigProvider)
			.inSingletonScope();
		bind<ISecurityConfigProvider>(ISecurityConfigProviderType)
			.to(FujiConfigProvider)
			.inSingletonScope();
		bind<IEncryptionConfigProvider>(IEncryptionConfigProviderType)
			.to(FujiConfigProvider)
			.inSingletonScope();
		bind<IRedisConfigProvider>(IRedisConfigProviderType)
			.to(FujiConfigProvider)
			.inSingletonScope();
	},
);
