import { Brand, make } from "ts-brand";

export type Nonce = Brand<string, "Nonce">;
export const Nonce = make<Nonce>();
