import { Brand, make } from "ts-brand";

export type IdentityId = Brand<string, "IdentityId">;
export const IdentityId = make<IdentityId>();
