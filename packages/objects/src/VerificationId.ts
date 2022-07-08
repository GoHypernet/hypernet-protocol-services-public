import { Brand, make } from "ts-brand";

export type VerificationId = Brand<string, "VerificationId">;
export const VerificationId = make<VerificationId>();
