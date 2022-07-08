import {
	IIdentityKeyRepository,
	IIdentityKeyRepositoryType,
} from "@authenticationContracts/interfaces/data";
import { AuthorizationService } from "@authorization/implementations/business";
import { IdentityKeyRepository } from "@authorization/implementations/data";
import { ConfigProvider } from "@authorization/implementations/utils";
import {
	IAuthorizationService,
	IAuthorizationServiceType,
} from "@authorization/interfaces/business";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@authorization/interfaces/utils";
import {
	ICryptoUtils,
	ICryptoUtilsType,
	CryptoUtils,
} from "@hypernetlabs/common-crypto-utils";
import {
	RedisProvider,
	IRedisProvider,
	IRedisProviderType,
	IRedisConfigProvider,
	IRedisConfigProviderType,
} from "@hypernetlabs/common-redis-provider";
import {
	AuthenticationServiceRepository,
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { MoleculerLogUtils } from "@hypernetlabs/hypernet.id-utils";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { ContainerModule, interfaces } from "inversify";

export const authorizationModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IAuthorizationService>(IAuthorizationServiceType)
			.to(AuthorizationService)
			.inSingletonScope();

		bind<IIdentityKeyRepository>(IIdentityKeyRepositoryType)
			.to(IdentityKeyRepository)
			.inSingletonScope();

		bind<IConfigProvider>(IConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<IRedisConfigProvider>(IRedisConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
		bind<ISecurityConfigProvider>(ISecurityConfigProviderType)
			.to(ConfigProvider)
			.inSingletonScope();
	},
);
