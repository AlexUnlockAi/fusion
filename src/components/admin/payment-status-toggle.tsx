"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updatePaymentStatus } from "@/app/admin/(dashboard)/orders/actions";
import type { PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PaymentStatusToggle({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: PaymentStatus;
}) {
  const [pending, startTransition] = useTransition();
  const isPaid = paymentStatus === "paid";

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      className={cn(
        "w-full",
        isPaid && "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      )}
      onClick={() => {
        const next: PaymentStatus = isPaid ? "unpaid" : "paid";
        startTransition(async () => {
          try {
            await updatePaymentStatus(orderId, next);
            toast.success(next === "paid" ? "Marked as paid" : "Marked as unpaid");
          } catch {
            toast.error("Couldn't update payment status.");
          }
        });
      }}
    >
      {isPaid ? "Paid" : "Mark as Paid"}
    </Button>
  );
}
