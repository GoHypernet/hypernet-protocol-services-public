import { Brand, make } from "ts-brand";

export type CorporateId = Brand<string, "CorporateId">;
export const CorporateId = make<CorporateId>();
