import { Campaign } from "@/types/campaign";

const KEY = "campaigns";

export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCampaigns(campaigns: Campaign[]): void {
  localStorage.setItem(KEY, JSON.stringify(campaigns));
}

export function addCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  saveCampaigns([...campaigns, campaign]);
}

export function deleteCampaign(index: number): void {
  const campaigns = getCampaigns();
  campaigns.splice(index, 1);
  saveCampaigns(campaigns);
}
