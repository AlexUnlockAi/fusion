export type OrderStatus =
  | "new"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";
export type PaymentStatus = "unpaid" | "paid";
export type InquiryType = "contact" | "event";
export type InquiryStatus = "new" | "contacted" | "archived";

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name_snapshot: string;
  price_cents_snapshot: number;
  quantity: number;
  notes: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  pickup_date: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_zip: string | null;
  delivery_fee_cents: number;
  subtotal_cents: number;
  total_cents: number;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string | null;
  phone: string | null;
  event_type: string | null;
  event_date: string | null;
  guest_count: number | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
];
