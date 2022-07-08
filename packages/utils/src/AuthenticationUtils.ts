import {
	ContextMeta,
	CorporateId,
	EAuthenticationTokenType,
	ECorporateRole,
	EService,
	IdentityId,
	ResolvedUserContext,
	UnauthorizedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { UnauthenticatedError } from "@hypernetlabs/hypernet.id-objects/src/errors/UnauthenticatedError";
import { Context } from "moleculer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class AuthenticationUtils {
	public static assureUserContext(
		context: Context<unknown, ContextMeta>,
	): UserContext {
		if (context.meta.user == null) {
			throw new UnauthenticatedError("No user context.");
		}
		return context.meta.user;
	}

	public static assureUserAuthenticatedByTokenType(
		userContext: ResolvedUserContext,
		tokenType: EAuthenticationTokenType,
	): ResultAsync<IdentityId, UnauthorizedError> {
		if (
			userContext.userToken == null ||
			userContext.resolvedUserToken == null
		) {
			return errAsync(new UnauthorizedError(`No user token presented!`));
		}
		if (userContext.resolvedUserToken.tokenType != tokenType) {
			return errAsync(
				new UnauthorizedError(
					`User is not authorized with the given tokenType: ${tokenType}.`,
				),
			);
		}
		if (userContext.resolvedUserToken.identityId == null) {
			return errAsync(new UnauthorizedError("User is not authorized."));
		}
		return okAsync(userContext.resolvedUserToken.identityId);
	}

	/**
	 * Ths method just assures that an identity token is presented, and returns the identityId.
	 * @param userContext
	 * @returns IdentityId
	 */
	public static assureUserAuthenticated(
		userContext: ResolvedUserContext,
	): ResultAsync<IdentityId, UnauthorizedError> {
		if (
			userContext.userToken == null ||
			userContext.resolvedUserToken == null
		) {
			return errAsync(new UnauthorizedError(`No user token presented!`));
		}
		if (
			userContext.resolvedUserToken.accountAddress == null ||
			userContext.resolvedUserToken.identityId == null
		) {
			return errAsync(new UnauthorizedError("User is not authorized."));
		}
		return okAsync(userContext.resolvedUserToken.identityId);
	}

	/**
	 * The rule for getting access to an identity is simple- either you ARE that identity (Identity Token), or
	 * you have a delegation token for that identity, OR you are a superadmin.
	 * @param userContext
	 */
	public static assureAccessToIdentity(
		userContext: ResolvedUserContext,
		identityId: IdentityId,
	): ResultAsync<void, UnauthorizedError> {
		if (
			userContext.userToken == null ||
			userContext.resolvedUserToken == null
		) {
			return errAsync(new UnauthorizedError(`No user token presented!`));
		}

		// If we are the user or if we are an admin, this is easy
		if (
			userContext.resolvedUserToken.identityId == identityId ||
			userContext.resolvedUserToken.admin
		) {
			return okAsync(undefined);
		}

		// Last chance, check the delegation tokens.
		const delegationToken = userContext.resolvedDelegationTokens.find(
			(val) => {
				return val.identityId == identityId;
			},
		);
		if (delegationToken != null) {
			return okAsync(undefined);
		}
		return errAsync(
			new UnauthorizedError(
				`User ${userContext.resolvedUserToken.identityId} does not have access to identity ${identityId}`,
			),
		);
	}

	public static assureServiceAuthenticated(
		userContext: ResolvedUserContext,
		allowedServices: EService[],
	): ResultAsync<void, UnauthorizedError> {
		if (
			userContext.serviceToken == null ||
			userContext.resolvedServiceToken == null
		) {
			return errAsync(
				new UnauthorizedError(`No service token presented!`),
			);
		}
		if (userContext.resolvedServiceToken.service == null) {
			return errAsync(
				new UnauthorizedError(
					"Service token does not include any service claim!",
				),
			);
		}

		if (
			!allowedServices.includes(userContext.resolvedServiceToken.service)
		) {
			return errAsync(
				new UnauthorizedError(
					`Service ${
						userContext.resolvedServiceToken.service
					} is not allowed! Allowed services: ${allowedServices.toString()}`,
				),
			);
		}

		return okAsync(undefined);
	}

	/**
	 * This method will return an UnauthorizedError if the user does not have a role in the specific corporate
	 * Corporate permissions are encoded either into the UserToken or can be encoded into delegation tokens.
	 * @param userContext ResolvedUserContext
	 * @param corporateId CorporateId
	 * @returns the user's actual role or UnauthorizedError
	 */
	public static assureCorporateAuthenticated(
		userContext: ResolvedUserContext,
		corporateId: CorporateId,
		minimumRole: ECorporateRole = ECorporateRole.Member,
	): ResultAsync<ECorporateRole, UnauthorizedError> {
		if (
			userContext.userToken == null ||
			userContext.resolvedUserToken == null
		) {
			return errAsync(new UnauthorizedError(`No user token presented!`));
		}

		// Admins can do anything, all the time.
		if (userContext.resolvedUserToken.admin) {
			return okAsync(ECorporateRole.Owner);
		}

		// OK, we have a user token
		const corporateRole =
			userContext.resolvedUserToken.corporatePermissions[corporateId];

		// If the user is an admin, we can skip all the rest of this
		if (userContext.resolvedUserToken.admin) {
			return okAsync(ECorporateRole.Owner);
		}

		// Check if there are any delegation tokens for the corporate
		// This might be hard to read; we need to loop over all the delegation tokens, and then
		// for the token, we look if the token delegates a role for the corporate. We need to
		// return the highest role that is delegated for the Corporate.
		const delegatedRole = userContext.resolvedDelegationTokens.reduce(
			(prev, cur) => {
				const delegatedCorporatePermissions =
					cur.corporatePermissions[corporateId];

				if (
					delegatedCorporatePermissions != null &&
					delegatedCorporatePermissions > prev
				) {
					prev = delegatedCorporatePermissions;
				}
				return prev;
			},
			ECorporateRole.None,
		);
		if (delegatedRole != ECorporateRole.None) {
			return okAsync(delegatedRole);
		}

		// If the is no corporate role for this Corporate in the UserToken, that won't work
		if (corporateRole == null || corporateRole == ECorporateRole.None) {
			return errAsync(
				new UnauthorizedError(
					`User does not have any role in Corporate ${corporateId}!`,
				),
			);
		}

		// The values for the ECorporateRole are setup specifically so we can do this
		if (corporateRole < minimumRole) {
			return errAsync(
				new UnauthorizedError(
					`User does not meet the minimum required role. This action requires at least the ${minimumRole} role`,
				),
			);
		}

		return okAsync(corporateRole);
	}

	public static assureUserIsAdmin(
		userContext: ResolvedUserContext,
	): ResultAsync<boolean, UnauthorizedError> {
		if (
			userContext.userToken == null ||
			userContext.resolvedUserToken == null
		) {
			return errAsync(new UnauthorizedError(`No user token presented!`));
		}
		if (
			userContext.resolvedUserToken.identityId == null ||
			userContext.resolvedUserToken.admin == false
		) {
			return errAsync(new UnauthorizedError("User is not authorized."));
		}
		return okAsync(userContext.resolvedUserToken.admin);
	}
}
