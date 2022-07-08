import {
	IConfigProvider,
	IConfigProviderType,
} from "@authorization/interfaces/utils";
import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

import { IPrismaProvider } from "@authorization/interfaces/data/utilities";
import { PrismaClient } from "@authorization/prisma/client";

@injectable()
export class PrismaProvider implements IPrismaProvider {
	protected prismaResult:
		| ResultAsync<PrismaClient, DatabaseError>
		| undefined;
	protected prisma: PrismaClient | undefined;

	constructor(
		@inject(IConfigProviderType) protected configProvider: IConfigProvider,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public getPrismaClient(): ResultAsync<PrismaClient, DatabaseError> {
		if (this.prismaResult == null) {
			this.prismaResult = this.initializeDatabase();
		}
		return this.prismaResult;
	}

	protected initializeDatabase(): ResultAsync<PrismaClient, DatabaseError> {
		return this.configProvider.getConfig().map((config) => {
			this.prisma = new PrismaClient({
				datasources: {
					db: {
						url: config.databaseConfig.connectionString,
					},
				},
			});

			return this.prisma;
		});
	}
}
