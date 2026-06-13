"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { deleteCampaign } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import CampaignDetailDialog from "./campaignDetailDialog";

type SortDir = "asc" | "desc" | null;

type Props = {
  campaigns: Campaign[];
  onDelete: () => void;
};

export default function CampaignsTable({ campaigns, onDelete }: Props) {
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleDelete(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    deleteCampaign(index);
    onDelete();
  }

  function toggleSort() {
    setSortDir((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  }

  const sorted = [...campaigns].sort((a, b) => {
    if (!sortDir) return 0;
    const pa = a.revenue - a.cost;
    const pb = b.revenue - b.cost;
    return sortDir === "desc" ? pb - pa : pa - pb;
  });

  const SortIcon = sortDir === "desc" ? ArrowDown : sortDir === "asc" ? ArrowUp : ArrowUpDown;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>
              <button
                onClick={toggleSort}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Profit <SortIcon className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No campaigns yet.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((campaign, index) => {
              const profit = campaign.revenue - campaign.cost;
              return (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setSelected(campaign)}
                >
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{campaign.clicks}</TableCell>
                  <TableCell>${campaign.cost.toFixed(2)}</TableCell>
                  <TableCell>${campaign.revenue.toFixed(2)}</TableCell>
                  <TableCell className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                    ${profit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={(e) => handleDelete(e, index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <CampaignDetailDialog campaign={selected} onClose={() => setSelected(null)} />
    </>
  );
}
