"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInquiryStatus } from "@/app/admin/(dashboard)/inquiries/actions";
import type { InquiryStatus } from "@/lib/types";

const STATUSES: InquiryStatus[] = ["new", "contacted", "archived"];
const LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  archived: "Archived",
};

export function InquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: InquiryStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          try {
            await updateInquiryStatus(id, value as InquiryStatus);
            toast.success(`Marked ${LABELS[value as InquiryStatus]}`);
          } catch {
            toast.error("Couldn't update status.");
          }
        });
      }}
    >
      <SelectTrigger size="sm" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
