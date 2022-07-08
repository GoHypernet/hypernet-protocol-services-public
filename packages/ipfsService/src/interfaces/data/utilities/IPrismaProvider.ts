import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { PrismaClient } from "@ipfs/prisma/client";
import { ResultAsync } from "neverthrow";

export interface IPrismaProvider {
	getPrismaClient(): ResultAsync<PrismaClient, DatabaseError>;
}

export const IPrismaProviderType = Symbol.for("IPrismaProvider");
