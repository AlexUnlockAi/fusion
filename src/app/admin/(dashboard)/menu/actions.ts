"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setOrderingEnabled(enabled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ value: enabled })
    .eq("key", "ordering_enabled");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/menu");
  revalidatePath("/admin");
  revalidatePath("/order");
}

export async function createCategory(name: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").insert({ name });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}

export type MenuItemInput = {
  id?: string;
  category_id: string | null;
  name: string;
  description: string;
  price_cents: number;
  image_url: string | null;
};

export async function upsertMenuItem(input: MenuItemInput) {
  const supabase = await createClient();

  if (input.id) {
    const { error } = await supabase
      .from("menu_items")
      .update({
        category_id: input.category_id,
        name: input.name,
        description: input.description,
        price_cents: input.price_cents,
        image_url: input.image_url,
      })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("menu_items").insert({
      category_id: input.category_id,
      name: input.name,
      description: input.description,
      price_cents: input.price_cents,
      image_url: input.image_url,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/order");
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/order");
}

export async function toggleItemAvailability(id: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/order");
}
