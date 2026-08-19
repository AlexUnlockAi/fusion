"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setOrderingEnabled } from "@/app/admin/(dashboard)/menu/actions";

export function OrderingToggle({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
      <div>
        <p className="font-heading text-base font-medium">Online Ordering</p>
        <p className="text-sm text-muted-foreground">
          When on, customers see the live menu and can check out. When off,
          the Order page shows &ldquo;Menu Coming Soon.&rdquo;
        </p>
      </div>
      <Switch
        checked={enabled}
        disabled={pending}
        onCheckedChange={(value) => {
          startTransition(async () => {
            try {
              await setOrderingEnabled(value);
              toast.success(value ? "Ordering is live" : "Ordering turned off");
            } catch {
              toast.error("Couldn't update ordering status.");
            }
          });
        }}
      />
    </div>
  );
}
