"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactInquiry, type InquiryFormState } from "@/app/actions/inquiries";

const fieldClass =
  "border-adinkra-cream/20 bg-adinkra-ink-2/60 text-adinkra-cream placeholder:text-adinkra-cream-muted";

export function ContactForm() {
  const [state, action, pending] = useActionState<InquiryFormState, FormData>(
    submitContactInquiry,
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
        <h3 className="font-heading text-xl font-medium">Message sent.</h3>
        <p className="text-adinkra-cream-muted">
          We&rsquo;ll get back to you soon.
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
          <Label htmlFor="phone" className="text-adinkra-cream">Phone</Label>
          <Input id="phone" name="phone" className={fieldClass} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-adinkra-cream">Email</Label>
        <Input id="email" name="email" type="email" className={fieldClass} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-adinkra-cream">Message</Label>
        <Textarea id="message" name="message" rows={5} required className={fieldClass} />
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
        Send Message
      </Button>
    </form>
  );
}
