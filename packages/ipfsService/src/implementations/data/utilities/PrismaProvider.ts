import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { IPrismaProvider } from "@ipfs/interfaces/data/utilities";
import { IConfigProvider, IConfigProviderType } from "@ipfs/interfaces/utils";
import { PrismaClient } from "@ipfs/prisma/client";
import { inject, injectable } from "inversify";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { ResultAsync } from "neverthrow";

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
