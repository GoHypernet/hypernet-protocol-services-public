import { ConfigProvider } from "@rinkeby/implementations/utils";
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

export const rinkebyModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IConfigProvider>(IConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<ISecurityConfigProvider>(ISecurityConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IEncryptionConfigProvider>(IEncryptionConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IRedisConfigProvider>(IRedisConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
	},
);
