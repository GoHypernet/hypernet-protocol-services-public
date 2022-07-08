import {
	ICryptoUtils,
	ICryptoUtilsType,
} from "@hypernetlabs/common-crypto-utils";
import {
	IRedisProvider,
	IRedisProviderType,
} from "@hypernetlabs/common-redis-provider";
import {
	IAuthenticationServiceRepository,
	IAuthenticationServiceRepositoryType,
	ResolveToken,
	ISecurityConfigProvider,
	ISecurityConfigProviderType,
} from "@hypernetlabs/hypernet.id-authentication-contracts";
import {
	BaseEvent,
	BaseJob,
	ContextMeta,
	JWKSError,
	QueueError,
	ResolvedToken,
	ResolvedUserContext,
	SignedResult,
	UnauthenticatedError,
	UserContext,
} from "@hypernetlabs/hypernet.id-objects";
import { ObjectUtils } from "@hypernetlabs/hypernet.id-utils";
import { JsonWebToken } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import Queue from "bee-queue";
import { interfaces } from "inversify";
import Moleculer, { Context, Errors } from "moleculer";
import { IOCService } from "moleculer-ioc";
import { okAsync, ResultAsync } from "neverthrow";
import hash from "object-hash";

import { JobProcessor } from "@security/JobProcessor";

export abstract class SecureService extends IOCService {
	public constructor(broker: Moleculer.ServiceBroker) {
		super(broker);

		const serviceSchema = this.getServiceSchema();

		this.parseServiceSchema(
			ObjectUtils.mergeDeep(
				{
					name: this.getServiceName(),
					events: {
						"$broker.started": {
							handler: async (
								ctx: Context<unknown, ContextMeta>,
							) => {
								const redisProvider = this.container.get(
									IRedisProviderType,
								) as IRedisProvider;

								await redisProvider
									.getRedisClient()
									.andThen((redisClient) => {
										// Register and start the queue processors
										const queueProcessors =
											this.getQueueProcessors();
										queueProcessors.forEach(
											(queueProcessor) => {
												const queue =
													new Queue<BaseJob>(
														queueProcessor.queueName,
														{
															redis: redisClient.getClient(),
															activateDelayedJobs:
																true,
														},
													);

												queue.on("error", (err) => {
													this.logger.error(err);
												});

												return ResultAsync.fromPromise(
													queue.ready(),
													(e) => {
														return new QueueError(
															"Queue cannot be started!",
															e,
														);
													},
												)
													.andThen((readyQueue) => {
														return ResultAsync.fromSafePromise(
															readyQueue.checkHealth(),
														).map(
															(
																healthCheckResult,
															) => {
																this.logger.debug(
																	`Starting queue processor for ${queueProcessor.queueName}`,
																);
																this.logger.debug(
																	healthCheckResult,
																);

																// Here's where the queue actually starts doing its thing
																this.setupProcessJob(
																	queueProcessor,
																	readyQueue,
																);
															},
														);
													})
													.mapErr((e) => {
														this.broker.logger.error(
															e,
														);
													});
											},
										);

										return this.onStarted(ctx);
									})
									.mapErr((e) => {
										// Convert the error to a throw, it gets picked up by Moleculer
										this.broker.logger.error(e);
										throw e;
									});
							},
						},
					},

					async stopped() {
						// Fired when broker stops this service (in `broker.stop()`)
						await this.onStopped().mapErr((e) => {
							this.broker.logger.error(e);
							throw e;
						});
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

	public onStarted(
		ctx: Context<unknown, ContextMeta>,
	): ResultAsync<void, unknown> {
		return okAsync(undefined);
	}

	public onStopped(): ResultAsync<void, unknown> {
		return okAsync(undefined);
	}

	protected setupProcessJob(
		queueProcessor: JobProcessor,
		queue: Queue<BaseJob>,
	): void {
		queue.process(async (job) => {
			/* this.logger.debug(
				`Processing job for queue ${queueProcessor.queueName}`,
			); */
			const service = this.container.get(
				queueProcessor.serviceIdentifier,
			);

			const result = await this.getResolvedUserTokens(
				job.data.userContext,
				job.data.userContext.requestId,
				job.data.userContext.parentId,
			).andThen((resolvedUserContext) => {
				return queueProcessor.handler(
					job.data,
					resolvedUserContext,
					service,
				);
			});

			// The handler returned an error, convert it to a throw. Bee-queue
			// will catch the error and re-process the job.
			if (result.isErr()) {
				throw result.error;
			}
		});
	}

	protected async signedActionHandler<
		TService,
		TResult = unknown,
		TParams = unknown,
	>(
		ctx: Context<TParams, ContextMeta>,
		serviceIdentifier: interfaces.ServiceIdentifier<TService>,
		handler: (
			resolvedUserContext: ResolvedUserContext,
			service: TService,
		) => ResultAsync<TResult, unknown>,
	): Promise<SignedResult<TResult>> {
		const configProvider = this.container.get<ISecurityConfigProvider>(
			ISecurityConfigProviderType,
		);

		const cryptoUtils = this.container.get<ICryptoUtils>(ICryptoUtilsType);

		const service = this.container.get(serviceIdentifier);

		if (ctx.meta.user == null) {
			throw new UnauthenticatedError(
				`Request to service ${this.getServiceName()} did not provide a UserContext`,
			);
		}

		if (ctx.meta.user.serviceToken == null) {
			throw new UnauthenticatedError(
				`Request to service ${this.getServiceName()} did not provide a Service Token`,
			);
		}

		const userContext = ctx.meta.user;

		// Verify that the request is coming from a valid source
		// Validate the service token
		const result = await configProvider.getConfig().andThen((config) => {
			return this.getResolvedUserTokens(
				userContext,
				ctx.requestID,
				ctx.parentID,
			)
				.andThen((resolvedUserContext) => {
					return handler(resolvedUserContext, service);
				})
				.andThen((result) => {
					// object-hash has issues with "undefined" results, but not with null. We can just
					// translate one to the other.
					if (result == undefined) {
						result = null;
					}
					// Calculate the signature for the result
					const resultHash = hash(result);
					return cryptoUtils
						.signMessage(resultHash, config.serviceKey)
						.map((signature) => {
							return new SignedResult(result, signature);
						});
				});
		});

		if (result.isErr()) {
			throw result.error;
		} else {
			return result.value;
		}
	}

	protected async signedEventHandler<TService, TEvent extends BaseEvent>(
		eventName: string,
		payload: TEvent,
		serviceIdentifier: interfaces.ServiceIdentifier<TService>,
		handler: (
			ruc: ResolvedUserContext,
			payload: TEvent,
			service: TService,
		) => ResultAsync<
			unknown,
			Errors.MoleculerRetryableError | Errors.MoleculerError
		>,
	): Promise<void> {
		// Start the tracing https://moleculer.services/docs/0.14/tracing.html#Connecting-spans-while-using-external-communication-module
		const span = this.broker.tracer.startSpan(eventName, payload);

		this.broker.logger.debug(eventName);

		const configProvider = this.container.get<ISecurityConfigProvider>(
			ISecurityConfigProviderType,
		);

		if (payload.userContext == null) {
			throw new UnauthenticatedError(
				`Request to service ${this.getServiceName()} did not provide a UserContext`,
			);
		}

		if (payload.userContext.serviceToken == null) {
			throw new UnauthenticatedError(
				`Request to service ${this.getServiceName()} did not provide a Service Token`,
			);
		}

		const userContext = payload.userContext;

		// Verify that the request is coming from a valid source
		// Validate the service token
		const result = await this.getResolvedUserTokens(
			userContext,
			userContext.requestId,
			userContext.parentId,
		).andThen((resolvedUserContext) => {
			// Get the service
			const service = this.container.get<TService>(serviceIdentifier);

			return ResultUtils.backoffAndRetry(() => {
				return handler(resolvedUserContext, payload, service).mapErr(
					(e) => {
						this.broker.logger.error(
							`Channel Event handler error for event ${eventName} in service ${this.getServiceName()}: ${e}`,
						);
						return e;
					},
				);
			}, [Errors.MoleculerRetryableError]);
		});

		// Finish the trace
		span.finish();

		if (result.isErr()) {
			throw result.error;
		}
	}

	protected getResolvedUserTokens(
		userContext: UserContext,
		requestId: string,
		parentId: string,
	): ResultAsync<ResolvedUserContext, JWKSError> {
		const authenticationServiceRepo =
			this.container.get<IAuthenticationServiceRepository>(
				IAuthenticationServiceRepositoryType,
			);
		return this.resolveTokens(
			authenticationServiceRepo,
			userContext.userToken,
			userContext.serviceToken,
			userContext.delegationTokens,
		).map((resolvedTokens) => {
			return new ResolvedUserContext(
				requestId,
				parentId,
				userContext.userToken,
				userContext.serviceToken,
				userContext.delegationTokens,
				resolvedTokens.userToken,
				resolvedTokens.serviceToken,
				resolvedTokens.delegationTokens,
			);
		});
	}

	protected resolveTokens(
		authenticationServiceRepo: IAuthenticationServiceRepository,
		userToken: JsonWebToken | null,
		serviceToken: JsonWebToken | null,
		delegationTokens: JsonWebToken[],
	): ResultAsync<ResolvedTokens, JWKSError> {
		const resolvedTokens = new ResolvedTokens();
		const calls = new Array<ResultAsync<void, JWKSError>>();
		if (userToken != null) {
			calls.push(
				authenticationServiceRepo
					.resolveToken(new ResolveToken(userToken))
					.map((val) => {
						resolvedTokens.userToken = val;
					}),
			);
		}
		if (serviceToken != null) {
			calls.push(
				authenticationServiceRepo
					.resolveToken(new ResolveToken(serviceToken))
					.map((val) => {
						resolvedTokens.serviceToken = val;
					}),
			);
		}

		// Could be lots of delegation tokens too
		calls.concat(
			delegationTokens.map((delegationToken) => {
				return authenticationServiceRepo
					.resolveToken(new ResolveToken(delegationToken))
					.map((val) => {
						resolvedTokens.delegationTokens.push(val);
					});
			}),
		);

		// Combine all the calls and you end up with a bunch of ResolvedTokens in a single ResolvedTokens
		return ResultUtils.combine(calls).map(() => {
			return resolvedTokens;
		});
	}
	public getQueueProcessors(): JobProcessor[] {
		return [];
	}
}

class ResolvedTokens {
	public constructor() {
		this.corporateTokens = [];
		this.delegationTokens = [];
	}
	public userToken: ResolvedToken;
	public serviceToken: ResolvedToken;
	public corporateTokens: ResolvedToken[];
	public delegationTokens: ResolvedToken[];
}
