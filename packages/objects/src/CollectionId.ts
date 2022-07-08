import { Brand, make } from "ts-brand";

export type CollectionId = Brand<string, "CollectionId">;
export const CollectionId = make<CollectionId>();
