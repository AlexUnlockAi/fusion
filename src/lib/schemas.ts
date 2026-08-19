import { z } from "zod";

export const ContactSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    email: z.email("Enter a valid email.").optional().or(z.literal("")),
    phone: z.string().trim().optional().or(z.literal("")),
    message: z.string().trim().min(5, "Tell us a bit more."),
  })
  .refine((data) => data.email || data.phone, {
    message: "Add an email or phone number so we can reach you back.",
    path: ["email"],
  });

export const EventInquirySchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    email: z.email("Enter a valid email.").optional().or(z.literal("")),
    phone: z.string().trim().optional().or(z.literal("")),
    eventType: z.string().trim().optional().or(z.literal("")),
    eventDate: z.string().trim().optional().or(z.literal("")),
    guestCount: z.string().trim().optional().or(z.literal("")),
    message: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.email || data.phone, {
    message: "Add an email or phone number so we can reach you back.",
    path: ["email"],
  });
