import { Brand, make } from "ts-brand";

export type ScreeningLink = Brand<string | null, "ScreeningLink">;
export const ScreeningLink = make<ScreeningLink>();
