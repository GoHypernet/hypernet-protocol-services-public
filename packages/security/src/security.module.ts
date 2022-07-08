import {
	CryptoUtils,
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	IRedisProvider,
	IRedisProviderType,
	RedisProvider,
} from "@hypernetlabs/common-redis-provider";
import {
	AuthenticationServiceRepository,
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	ConcurrencyUtils,
	IConcurrencyUtils,
	IConcurrencyUtilsType,
	MoleculerLogUtils,
} from "@hypernetlabs/hypernet.id-utils";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { ContainerModule, interfaces } from "inversify";

export const securityModule = new ContainerModule(
	(
		bind: interfaces.Bind,
		_unbind: interfaces.Unbind,
		_isBound: interfaces.IsBound,
		_rebind: interfaces.Rebind,
	) => {
		bind<IAuthenticationServiceRepository>(
			IAuthenticationServiceRepositoryType,
		)
			.to(AuthenticationServiceRepository)
			.inSingletonScope();
		bind<IConcurrencyUtils>(IConcurrencyUtilsType)
			.to(ConcurrencyUtils)
			.inSingletonScope();
		bind<IRedisProvider>(IRedisProviderType)
			.to(RedisProvider)
			.inSingletonScope();
		bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
		bind<ILogUtils>(ILogUtilsType).to(MoleculerLogUtils).inSingletonScope();
	},
);
