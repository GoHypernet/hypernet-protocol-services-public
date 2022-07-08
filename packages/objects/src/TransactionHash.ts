import { Brand, make } from "ts-brand";

export type TransactionHash = Brand<string, "TransactionHash">;
export const TransactionHash = make<TransactionHash>();
