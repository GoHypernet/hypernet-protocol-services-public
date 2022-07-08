import { Brand, make } from "ts-brand";

export type EscrowWalletId = Brand<string, "EscrowWalletId">;
export const EscrowWalletId = make<EscrowWalletId>();
