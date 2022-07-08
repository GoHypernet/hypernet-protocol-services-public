import {
	IRedisConfigProvider,
	IRedisConfigProviderType,
} from "@hypernetlabs/common-redis-provider";
import {
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	EventRepository,
	IEventRepository,
	IEventRepositoryType,
} from "@hypernetlabs/hypernet.id-events";
import { ContainerModule, interfaces } from "inversify";

import {
	TokenService,
	WalletAuthenticationService,
} from "@authentication/implementations/business";
import { ConfigProvider } from "@authentication/implementations/utils";
import {
	ITokenService,
	ITokenServiceType,
	IWalletAuthenticationService,
	IWalletAuthenticationServiceType,
} from "@authentication/interfaces/business";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@authentication/interfaces/utils";

export const authenticationModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<ITokenService>(ITokenServiceType)
			.to(TokenService)
			.inSingletonScope();
		bind<IWalletAuthenticationService>(IWalletAuthenticationServiceType)
			.to(WalletAuthenticationService)
			.inSingletonScope();

		bind<IEventRepository>(IEventRepositoryType)
			.to(EventRepository)
			.inSingletonScope();

		bind<IConfigProvider>(IConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<ISecurityConfigProvider>(ISecurityConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IRedisConfigProvider>(IRedisConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
	},
);
