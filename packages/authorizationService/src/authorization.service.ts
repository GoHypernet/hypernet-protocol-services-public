import { authorizationModule } from "@authorization/implementations/modules";
import {
	IAuthorizationService,
	IAuthorizationServiceType,
} from "@authorization/interfaces/business";
import {
	ContextMeta,
	EService,
	IdentityCreatedEvent,
} from "@hypernetlabs/hypernet.id-objects";
import {
	SecureService,
	securityModule,
} from "@hypernetlabs/hypernet.id-security";
import { ContainerModule } from "inversify";
import { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";

export default class AuthorizationService extends SecureService {
	public getServiceName(): string {
		return EService.Authorization;
	}
	public getServiceSchema(): Partial<ServiceSchema<ServiceSettingSchema>> {
		return {
			actions: {
				getNonce: {
					params: {
						accountAddress: { type: "string" },
					},
					handler: async (ctx: Context<unknown, ContextMeta>) => {
						const authenticationService =
							this.container.get<IAuthorizationService>(
								IAuthorizationServiceType,
							);
						// const result =
						// 	await authenticationService.getCurrentNonce(
						// 		ctx.params.accountAddress,
						// 	);

						// if (result.isErr()) {
						// 	throw result.error;
						// } else {
						// 	return result.value;
						// }
					},
				},
			},
			events: {},
			channels: {
				[IdentityCreatedEvent.eventName]: {
					group: EService.Authorization,
					maxInFlight: 2,
					handler: async (_payload: IdentityCreatedEvent) => {
						this.broker.logger.debug(
							`Authorization Service: ${IdentityCreatedEvent.eventName}`,
						);
					},
				},
			},
		};
	}

	public modules(): ContainerModule[] {
		return [authorizationModule, securityModule];
	}
}
