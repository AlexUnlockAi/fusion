"use server";

import { createClient } from "@/lib/supabase/server";
import { ContactSchema, EventInquirySchema } from "@/lib/schemas";

export type InquiryFormState =
  | { success: true }
  | { success: false; error: string }
  | undefined;

export async function submitContactInquiry(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    type: "contact",
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function submitEventInquiry(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const parsed = EventInquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    eventType: formData.get("eventType"),
    eventDate: formData.get("eventDate"),
    guestCount: formData.get("guestCount"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    type: "event",
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    event_type: parsed.data.eventType || null,
    event_date: parsed.data.eventDate || null,
    guest_count: parsed.data.guestCount ? Number(parsed.data.guestCount) : null,
    message: parsed.data.message || null,
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
