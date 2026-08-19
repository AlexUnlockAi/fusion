"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitEventInquiry, type InquiryFormState } from "@/app/actions/inquiries";

const fieldClass =
  "border-adinkra-cream/20 bg-adinkra-ink-2/60 text-adinkra-cream placeholder:text-adinkra-cream-muted";

export function EventForm() {
  const [state, action, pending] = useActionState<InquiryFormState, FormData>(
    submitEventInquiry,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-adinkra-ink-2/60 p-10 text-center ring-1 ring-adinkra-cream/10">
        <CheckCircle2 className="size-10 text-adinkra-green" />
        <h3 className="font-heading text-xl font-medium">Inquiry received.</h3>
        <p className="text-adinkra-cream-muted">
          We&rsquo;ll follow up within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-adinkra-cream">Name</Label>
          <Input id="name" name="name" required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventType" className="text-adinkra-cream">Event Type</Label>
          <Input id="eventType" name="eventType" placeholder="Wedding, corporate lunch, etc." className={fieldClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-adinkra-cream">Email</Label>
          <Input id="email" name="email" type="email" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-adinkra-cream">Phone</Label>
          <Input id="phone" name="phone" className={fieldClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-adinkra-cream">Event Date</Label>
          <Input id="eventDate" name="eventDate" type="date" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestCount" className="text-adinkra-cream">Guest Count</Label>
          <Input id="guestCount" name="guestCount" type="number" min={1} className={fieldClass} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-adinkra-cream">Tell us about your event</Label>
        <Textarea id="message" name="message" rows={5} className={fieldClass} />
      </div>

      {state && !state.success && (
        <p className="text-sm text-adinkra-red">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="rounded-full bg-adinkra-gold px-7 text-adinkra-ink hover:bg-adinkra-gold/90"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        Submit Inquiry
      </Button>
    </form>
  );
}
