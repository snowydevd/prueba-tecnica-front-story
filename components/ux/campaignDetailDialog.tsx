"use client";

import { Campaign } from "@/types/campaign";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  campaign: Campaign | null;
  onClose: () => void;
};

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col gap-1 bg-zinc-50 rounded-lg p-3">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-lg font-semibold ${className}`}>{value}</span>
    </div>
  );
}

export default function CampaignDetailDialog({ campaign, onClose }: Props) {
  if (!campaign) return null;

  const profit = campaign.revenue - campaign.cost;
  const profitPositive = profit >= 0;

  return (
    <Dialog open={!!campaign} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{campaign.name}</DialogTitle>
          <p className="text-xs text-muted-foreground">
            {new Date(campaign.startDate).toLocaleDateString()} — {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Stat label="Clicks" value={campaign.clicks.toLocaleString()} />
          <Stat label="Cost" value={`$${campaign.cost.toFixed(2)}`} />
          <Stat label="Revenue" value={`$${campaign.revenue.toFixed(2)}`} />
          <Stat
            label="Profit"
            value={`${profitPositive ? "+" : ""}$${profit.toFixed(2)}`}
            className={profitPositive ? "text-green-600" : "text-red-600"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
