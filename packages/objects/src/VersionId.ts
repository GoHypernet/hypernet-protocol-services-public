import { Brand, make } from "ts-brand";

export type VersionId = Brand<number, "VersionId">;
export const VersionId = make<VersionId>();
