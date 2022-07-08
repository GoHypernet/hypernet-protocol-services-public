import { Brand, make } from "ts-brand";

export type IdentityTokenContent = Brand<string, "IdentityTokenContent">;
export const IdentityTokenContent = make<IdentityTokenContent>();
