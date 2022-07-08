import { DatabaseError } from "@hypernetlabs/hypernet.id-objects";
import { ResultAsync } from "neverthrow";

import { PrismaClient } from "@corporate/prisma/client";

export interface IPrismaProvider {
	getPrismaClient(): ResultAsync<PrismaClient, DatabaseError>;
}

export const IPrismaProviderType = Symbol.for("IPrismaProvider");
