"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePickupSettings(data: {
  venue: string;
  city: string;
  schedule: string;
  hours: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value: data })
    .eq("key", "pickup");
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/order");
}

export async function updateDeliverySettings(data: {
  area: string;
  fee_cents: number;
  minimum_cents: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value: data })
    .eq("key", "delivery");
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/order");
}
