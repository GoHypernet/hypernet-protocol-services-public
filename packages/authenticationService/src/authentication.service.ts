import "reflect-metadata";
import {
	GetMessage,
	GetNonce,
	ResolveToken,
	SubmitSignedNonce,
	Logout,
	SubmitSignedServiceNonce,
	GetServiceNonce,
	ExchangeCorporateSecretForToken,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import { corporateModule } from "@hypernetlabs/hypernet.id-corporate-contracts";
import { identityModule } from "@hypernetlabs/hypernet.id-identity-contracts";
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
import { okAsync } from "neverthrow";

import { authenticationModule } from "@authentication/implementations/modules";
import {
	ITokenService,
	ITokenServiceType,
	IWalletAuthenticationService,
	IWalletAuthenticationServiceType,
} from "@authentication/interfaces/business";

export default class AuthenticationService extends SecureService {
	public getServiceSchema(): Partial<ServiceSchema<ServiceSettingSchema>> {
		return {
			actions: {
				[ExchangeCorporateSecretForToken.actionName]: {
					handler: async (
						ctx: Context<
							ExchangeCorporateSecretForToken,
							ContextMeta
						>,
					) => {
						return this.signedActionHandler<ITokenService>(
							ctx,
							ITokenServiceType,
							(ruc, tokenService) => {
								return tokenService.exchangeCorporateSecretForToken(
									ruc,
									ctx.params.corporateId,
									ctx.params.corporateSecret,
								);
							},
						);
					},
				},
				[GetNonce.actionName]: {
					params: {
						accountAddress: { type: "string" },
					},
					handler: async (ctx: Context<GetNonce, ContextMeta>) => {
						return this.signedActionHandler<IWalletAuthenticationService>(
							ctx,
							IWalletAuthenticationServiceType,
							(ruc, authenticationService) => {
								return authenticationService.getCurrentNonce(
									ctx.params.accountAddress,
								);
							},
						);
					},
				},
				[GetServiceNonce.actionName]: {
					handler: async (
						ctx: Context<GetServiceNonce, ContextMeta>,
					) => {
						const authenticationService =
							this.container.get<IWalletAuthenticationService>(
								IWalletAuthenticationServiceType,
							);
						const result =
							await authenticationService.getCurrentServiceNonce(
								ctx.params.service,
							);
						if (result.isErr()) {
							throw result.error;
						} else {
							return result.value;
						}
					},
				},
				[GetMessage.actionName]: {
					params: {
						referralLinkId: { type: "string", optional: true },
					},
					handler: async (ctx: Context<GetMessage, ContextMeta>) => {
						return this.signedActionHandler<IWalletAuthenticationService>(
							ctx,
							IWalletAuthenticationServiceType,
							(ruc, authenticationService) => {
								return okAsync(
									authenticationService.getMessage(
										ctx.params.referralLinkId,
									),
								);
							},
						);
					},
				},
				[SubmitSignedNonce.actionName]: {
					params: {
						accountAddress: { type: "string" },
						signature: { type: "string" },
						referralLinkId: { type: "string", optional: true },
					},
					handler: async (
						ctx: Context<SubmitSignedNonce, ContextMeta>,
					) => {
						return this.signedActionHandler<IWalletAuthenticationService>(
							ctx,
							IWalletAuthenticationServiceType,
							(ruc, authenticationService) => {
								return authenticationService.submitSignedNonce(
									ruc,
									ctx.params.accountAddress,
									ctx.params.signature,
									ctx.params.referralLinkId,
									ctx.params.nftNonce,
								);
							},
						);
					},
				},
				[SubmitSignedServiceNonce.actionName]: {
					handler: async (
						ctx: Context<SubmitSignedServiceNonce, ContextMeta>,
					) => {
						const authenticationService =
							this.container.get<IWalletAuthenticationService>(
								IWalletAuthenticationServiceType,
							);
						const result =
							await authenticationService.submitSignedServiceNonce(
								ctx.params.service,
								ctx.params.signature,
							);
						if (result.isErr()) {
							throw result.error;
						} else {
							return result.value;
						}
					},
				},
				[Logout.actionName]: {
					handler: async (ctx: Context<Logout, ContextMeta>) => {
						const domain = process.env["DOMAIN"] || "";
						ctx.meta.$responseHeaders = {
							"Set-Cookie": `token=;Max-Age=${-1};SameSite=None;Secure;Path=/;Domain=${domain};HttpOnly;`,
						};
						return null;
					},
				},
				[ResolveToken.actionName]: {
					cache: {
						keys: ["token"],
						ttl: 60 * 60, // 1 hour
					},
					params: {
						token: { type: "string" },
					},
					handler: async (ctx: Context<ResolveToken>) => {
						// VERY IMPORTANT
						// Do not use signedActionHandler here or you will get some crazy bad loops, since that method
						// calls ResolveToken!
						const tokenService =
							this.container.get<ITokenService>(
								ITokenServiceType,
							);
						const result = await tokenService.resolveToken(
							ctx.params.token,
						);

						if (result.isErr()) {
							throw result.error;
						} else {
							return result.value;
						}
					},
				},
			},
			channels: {
				[IdentityCreatedEvent.eventName]: {
					group: EService.Authentication,
					maxInFlight: 2,
					handler: async (_payload: IdentityCreatedEvent) => {
						this.broker.logger.debug(
							`Authentication Service: ${IdentityCreatedEvent.eventName}`,
						);
					},
				},
			},
		};
	}

	public getServiceName(): string {
		return EService.Authentication;
	}

	public modules(): ContainerModule[] {
		return [
			authenticationModule,
			securityModule,
			identityModule,
			corporateModule,
		];
	}
}
