"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { addCampaign } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type Props = {
  onAdd: () => void;
};

const empty = {
  name: "",
  startDate: "",
  endDate: "",
  clicks: "",
  cost: "",
  revenue: "",
};

export default function AddCampaignDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof typeof empty, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.startDate) newErrors.startDate = "Required.";
    if (!form.endDate) newErrors.endDate = "Required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "Must be after start date.";
    if (Number(form.clicks) < 0) newErrors.clicks = "Cannot be negative.";
    if (Number(form.cost) < 0) newErrors.cost = "Cannot be negative.";
    if (Number(form.revenue) < 0) newErrors.revenue = "Cannot be negative.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const campaign: Campaign = {
      name: form.name,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      clicks: Number(form.clicks),
      cost: Number(form.cost),
      revenue: Number(form.revenue),
    };
    addCampaign(campaign);
    onAdd();
    setForm(empty);
    setErrors({});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1">
            <input
              name="name"
              placeholder="Campaign name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs text-muted-foreground">Start date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm ${errors.startDate ? "border-red-500" : ""}`}
              />
              {errors.startDate && <span className="text-xs text-red-500">{errors.startDate}</span>}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-xs text-muted-foreground">End date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm ${errors.endDate ? "border-red-500" : ""}`}
              />
              {errors.endDate && <span className="text-xs text-red-500">{errors.endDate}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <input
              name="clicks"
              type="number"
              placeholder="Clicks"
              value={form.clicks}
              onChange={handleChange}
              min={0}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.clicks ? "border-red-500" : ""}`}
            />
            {errors.clicks && <span className="text-xs text-red-500">{errors.clicks}</span>}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <input
                name="cost"
                type="number"
                placeholder="Cost ($)"
                value={form.cost}
                onChange={handleChange}
                min={0}
                step="0.01"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.cost ? "border-red-500" : ""}`}
              />
              {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <input
                name="revenue"
                type="number"
                placeholder="Revenue ($)"
                value={form.revenue}
                onChange={handleChange}
                min={0}
                step="0.01"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.revenue ? "border-red-500" : ""}`}
              />
              {errors.revenue && <span className="text-xs text-red-500">{errors.revenue}</span>}
            </div>
          </div>
          <Button type="submit" className="mt-2">Save campaign</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
