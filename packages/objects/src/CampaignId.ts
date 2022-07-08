import { Brand, make } from "ts-brand";

export type CampaignId = Brand<string, "CampaignId">;
export const CampaignId = make<CampaignId>();
