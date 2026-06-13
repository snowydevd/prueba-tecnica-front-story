"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { getCampaigns } from "@/lib/storage";
import CampaignsTable from "@/components/ux/campaignsTable";
import AddCampaignDialog from "@/components/ux/addCampaignDialog";

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  function refresh() {
    setCampaigns(getCampaigns());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="min-w-2xl flex justify-between items-center text-gray-700 ">
        <span className="font-sans leading-6">Lautaro Chini</span>
        <span>Front Story</span>
      </div>
      <section className="shadow-2xl p-16 rounded-lg">
        <div className="flex justify-between items-center min-w-2xl mb-10">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <AddCampaignDialog onAdd={refresh} />
        </div>
        <CampaignsTable campaigns={campaigns} onDelete={refresh} />
      </section>
    </div>
  );
}
