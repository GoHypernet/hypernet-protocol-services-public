import { Brand, make } from "ts-brand";

export type UsernameString = Brand<string, "UsernameString">;
export const UsernameString = make<UsernameString>();
