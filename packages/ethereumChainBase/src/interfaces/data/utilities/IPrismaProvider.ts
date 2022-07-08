import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { PrismaClient } from "@ethereumChainBase/prisma/client";
import { ResultAsync } from "neverthrow";

export interface IPrismaProvider {
	getPrismaClient(): ResultAsync<PrismaClient, DatabaseError>;
}

export const IPrismaProviderType = Symbol.for("IPrismaProvider");
