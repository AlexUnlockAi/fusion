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
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          try {
            await updateOrderStatus(orderId, value as OrderStatus);
            toast.success(`Order marked ${ORDER_STATUS_LABELS[value as OrderStatus]}`);
          } catch {
            toast.error("Couldn't update the order status.");
          }
        });
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
