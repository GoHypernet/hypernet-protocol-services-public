import { Brand, make } from "ts-brand";

export type ScreeningResults = Brand<number | null, "ScreeningResults">;
export const ScreeningResults = make<ScreeningResults>();
