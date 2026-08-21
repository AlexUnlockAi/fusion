"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePickupSettings(data: {
  venue: string;
  address: string;
  city: string;
  schedule: string;
  saturdayHours: string;
  sundayHours: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value: data })
    .eq("key", "pickup");
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/order");
  revalidatePath("/frisco-fresh-market");
}
