"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateDeliverySettings,
  updatePickupSettings,
} from "@/app/admin/(dashboard)/settings/actions";

export function PickupSettingsForm({
  initial,
}: {
  initial: { venue: string; city: string; schedule: string; hours: string };
}) {
  const [venue, setVenue] = useState(initial.venue);
  const [city, setCity] = useState(initial.city);
  const [schedule, setSchedule] = useState(initial.schedule);
  const [hours, setHours] = useState(initial.hours);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Pickup Venue</Label>
          <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Days</Label>
          <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Hours</Label>
          <Input value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await updatePickupSettings({ venue, city, schedule, hours });
              toast.success("Pickup details saved");
            } catch {
              toast.error("Couldn't save pickup details.");
            }
          })
        }
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        Save Pickup Details
      </Button>
    </div>
  );
}

export function DeliverySettingsForm({
  initial,
}: {
  initial: { area: string; fee_cents: number; minimum_cents: number };
}) {
  const [area, setArea] = useState(initial.area);
  const [fee, setFee] = useState((initial.fee_cents / 100).toFixed(2));
  const [minimum, setMinimum] = useState(
    (initial.minimum_cents / 100).toFixed(2)
  );
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label>Delivery Area</Label>
          <Input value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Delivery Fee (USD)</Label>
          <Input inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Order Minimum (USD)</Label>
          <Input
            inputMode="decimal"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
          />
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await updateDeliverySettings({
                area,
                fee_cents: Math.round(parseFloat(fee || "0") * 100),
                minimum_cents: Math.round(parseFloat(minimum || "0") * 100),
              });
              toast.success("Delivery details saved");
            } catch {
              toast.error("Couldn't save delivery details.");
            }
          })
        }
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        Save Delivery Details
      </Button>
    </div>
  );
}
