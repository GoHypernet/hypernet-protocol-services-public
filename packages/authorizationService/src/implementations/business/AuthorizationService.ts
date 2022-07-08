import {
	IIdentityKeyRepository,
	IIdentityKeyRepositoryType,
} from "@authenticationContracts/interfaces/data";
import { IAuthorizationService } from "@authorization/interfaces/business";
import {
	IConfigProvider,
	IConfigProviderType,
} from "@authorization/interfaces/utils";
import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import { AESKey } from "@hypernetlabs/common-objects";
import {
	IRedisProviderType,
	IRedisProvider,
	RedisError,
} from "@hypernetlabs/common-redis-provider";
import {
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
	ResolveToken,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	ContextMeta,
	DatabaseError,
	EAuthenticationTokenType,
	EService,
	IdentityId,
	InvalidSignatureError,
	JWKSError,
	ResolvedUserContext,
	UnauthorizedError,
} from "@hypernetlabs/hypernet.id-objects";
import {
	EthereumAddress,
	JsonWebToken,
	Signature,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import { Context, LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class AuthorizationService implements IAuthorizationService {
	public constructor(
		@inject(IIdentityKeyRepositoryType)
		protected identityKeyRepository: IIdentityKeyRepository,
		@inject(IAuthenticationServiceRepositoryType)
		protected authenticationServiceRepository: IAuthenticationServiceRepository,
		@inject(IRedisProviderType) protected redisProvider: IRedisProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
		@inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
	) {}

	public getIdentityKey(
		userContext: ResolvedUserContext,
		serviceToken: JsonWebToken,
		identityId: IdentityId,
	): ResultAsync<AESKey, UnauthorizedError | DatabaseError | JWKSError> {
		// First step, make sure that the service token is valid
		return this.authenticationServiceRepository
			.resolveToken(new ResolveToken(serviceToken))
			.andThen((userContext) => {
				// Make sure the userContext is for a service
				if (
					userContext.tokenType != EAuthenticationTokenType.Service ||
					userContext.service == null
				) {
					return errAsync(
						new UnauthorizedError(
							`getIdentityKey may only be called by a service with a valid Service Token`,
						),
					);
				}

				// OK, it's a valid token from a service. Now determine if there is any reason the service should not have access to
				// the requested identity.
				return this.checkServiceAccessToIdentity(
					userContext.service,
					identityId,
				);
			})
			.andThen(() => {
				// If we got here, there's no reason to deny the service access. We'll need to get the current IdentityKey from the DB,
				// along with our own decryption key
				return ResultUtils.combine([
					this.identityKeyRepository.getByIdentityId(identityId),
					this.configProvider.getConfig(),
				]);
			})
			.andThen(([identityKey, config]) => {
				if (identityKey == null) {
					throw new Error();
				}
				return this.cryptoUtils.decryptAESEncryptedString(
					identityKey.identityDecryptionKey,
					config.encryptionKey,
				);
			})
			.map((identityDecryptionKey) => {
				return AESKey(identityDecryptionKey);
			});
	}

	protected checkServiceAccessToIdentity(
		_service: EService,
		_identityId: IdentityId,
	): ResultAsync<void, UnauthorizedError> {
		return okAsync(undefined);
	}
}
