"use server";

import { createClient } from "@/lib/supabase/server";

export type PlaceOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: "pickup";
  pickupDate: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryZip: string | null;
  notes: string;
  items: { menuItemId: string; quantity: number; notes?: string }[];
};

export type PlaceOrderResult =
  | { success: true; orderNumber: string; totalCents: number }
  | { success: false; error: string };

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  if (!input.customerName.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (input.items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }
  if (!input.pickupDate) {
    return { success: false, error: "Choose a pickup date." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: input.customerName.trim(),
    p_customer_email: input.customerEmail.trim() || null,
    p_customer_phone: input.customerPhone.trim() || null,
    p_fulfillment_type: input.fulfillmentType,
    p_pickup_date: input.pickupDate,
    p_delivery_address: input.deliveryAddress,
    p_delivery_city: input.deliveryCity,
    p_delivery_zip: input.deliveryZip,
    p_notes: input.notes.trim() || null,
    p_items: input.items.map((i) => ({
      menu_item_id: i.menuItemId,
      quantity: i.quantity,
      notes: i.notes ?? "",
    })),
  });

  if (error) {
    return { success: false, error: "Couldn't place your order. Please try again." };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    success: true,
    orderNumber: row.order_number,
    totalCents: row.total_cents,
  };
}
