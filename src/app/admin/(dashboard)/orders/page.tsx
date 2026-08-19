import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCents } from "@/lib/money";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: ORDER_STATUS_LABELS.new, value: "new" },
  { label: ORDER_STATUS_LABELS.preparing, value: "preparing" },
  { label: ORDER_STATUS_LABELS.ready, value: "ready" },
  { label: ORDER_STATUS_LABELS.out_for_delivery, value: "out_for_delivery" },
  { label: ORDER_STATUS_LABELS.completed, value: "completed" },
  { label: ORDER_STATUS_LABELS.cancelled, value: "cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatus | undefined) ?? "all";

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, customers(name, phone)")
    .order("created_at", { ascending: false });

  if (activeStatus !== "all") {
    query = query.eq("status", activeStatus);
  }

  const { data } = await query;
  const orders = (data ?? []) as (Order & {
    customers: { name: string; phone: string | null } | null;
  })[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Every pickup and delivery order, in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/orders" : `/admin/orders?status=${f.value}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeStatus === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No orders here yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.order_number}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    {order.customers?.name ?? "—"}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {order.fulfillment_type}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {order.payment_status}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCents(order.total_cents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
