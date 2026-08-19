"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCustomerNotes(customerId: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ notes })
    .eq("id", customerId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/customers/${customerId}`);
}
