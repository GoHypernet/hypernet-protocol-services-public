import { IncomingMessage } from "http";

import {
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { ContextMeta, UserContext } from "@hypernetlabs/hypernet.id-objects";
import {
	AuthenticationUtils,
	ObjectUtils,
} from "@hypernetlabs/hypernet.id-utils";
import { JsonWebToken } from "@hypernetlabs/objects";
import { interfaces } from "inversify";
import Moleculer, { Context } from "moleculer";
import { IOCService } from "moleculer-ioc";
import ApiGateway from "moleculer-web";
import { ResultAsync } from "neverthrow";

export abstract class GatewayService extends IOCService {
	public constructor(broker: Moleculer.ServiceBroker) {
		super(broker);

		const serviceSchema = this.getServiceSchema();

		this.parseServiceSchema(
			ObjectUtils.mergeDeep(
				{
					name: this.getServiceName(),
					mixins: [ApiGateway],
					methods: {
						authenticate: async (
							ctx: Context,
							_route: unknown,
							req: IncomingMessage,
						): Promise<UserContext> => {
							// Get the service token
							const authenticationServiceRepo =
								this.container.get<IAuthenticationServiceRepository>(
									IAuthenticationServiceRepositoryType,
								);

							const serviceTokenResult =
								await authenticationServiceRepo.getServiceToken();

							if (serviceTokenResult.isErr()) {
								// No token. Throw an error
								throw serviceTokenResult.error;
							}

							// Read the token from header
							let userToken: JsonWebToken | null = null;
							const cookie = req.headers.cookie;
							const value = `; ${cookie}`;
							const parts = value.split(`; token=`);
							if (parts.length === 2) {
								userToken = JsonWebToken(
									parts.pop()?.split(";").shift(),
								);
							}

							// If the token is not passed in the cookie, look for it in the Authorization header
							if (
								userToken == null &&
								req.headers.authorization != null
							) {
								userToken = JsonWebToken(
									req.headers.authorization.replace(
										"Bearer ",
										"",
									),
								);
							}

							// TODO: we need to read in any corporate and delegation tokens that may be offered!
							return new UserContext(
								ctx.requestID,
								ctx.parentID,
								userToken,
								serviceTokenResult.value,
								[], // delegation tokens
							);
						},
					},
				},
				serviceSchema,
			) as Moleculer.ServiceSchema<Moleculer.ServiceSettingSchema>,
		);
	}

	public abstract getServiceName(): string;
	public abstract getServiceSchema(): Partial<
		Moleculer.ServiceSchema<Moleculer.ServiceSettingSchema>
	>;

	protected async internalActionHandler<
		TService,
		TParams = unknown,
		TResult = unknown,
	>(
		ctx: Context<TParams, ContextMeta>,
		serviceIdentifier: interfaces.ServiceIdentifier<TService>,
		func: (
			userContext: UserContext,
			service: TService,
		) => ResultAsync<TResult, unknown>,
	): Promise<TResult> {
		// Get the service- we only support a single one with this method.
		const service = this.container.get(serviceIdentifier);

		// Call the function, providing the user context (unresolved) and the "injected" service
		const result = await func(
			AuthenticationUtils.assureUserContext(ctx),
			service,
		);

		// Unwrap the results for use by the web gateway
		if (result.isErr()) {
			throw result.error;
		} else {
			return result.value;
		}
	}

	protected prepUUIDParam(uuidParam: string): string {
		return uuidParam.toLowerCase().trim();
	}
}
