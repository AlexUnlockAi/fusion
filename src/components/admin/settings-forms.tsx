"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePickupSettings } from "@/app/admin/(dashboard)/settings/actions";

export function PickupSettingsForm({
  initial,
}: {
  initial: {
    venue: string;
    address: string;
    city: string;
    schedule: string;
    saturdayHours: string;
    sundayHours: string;
  };
}) {
  const [venue, setVenue] = useState(initial.venue);
  const [address, setAddress] = useState(initial.address);
  const [city, setCity] = useState(initial.city);
  const [schedule, setSchedule] = useState(initial.schedule);
  const [saturdayHours, setSaturdayHours] = useState(initial.saturdayHours);
  const [sundayHours, setSundayHours] = useState(initial.sundayHours);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Pickup Venue</Label>
          <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Street Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>City, State, Zip</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Days</Label>
          <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Saturday Hours</Label>
          <Input
            value={saturdayHours}
            onChange={(e) => setSaturdayHours(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sunday Hours</Label>
          <Input
            value={sundayHours}
            onChange={(e) => setSundayHours(e.target.value)}
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
              await updatePickupSettings({
                venue,
                address,
                city,
                schedule,
                saturdayHours,
                sundayHours,
              });
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
