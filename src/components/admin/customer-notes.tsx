"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateCustomerNotes } from "@/app/admin/(dashboard)/customers/actions";

export function CustomerNotes({
  customerId,
  initialNotes,
}: {
  customerId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Preferences, allergies, delivery notes…"
        rows={4}
      />
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await updateCustomerNotes(customerId, notes);
              toast.success("Notes saved");
            } catch {
              toast.error("Couldn't save notes.");
            }
          })
        }
      >
        Save Notes
      </Button>
    </div>
  );
}
