import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { PaymentStatusToggle } from "@/components/admin/payment-status-toggle";
import { formatCents } from "@/lib/money";
import type { Customer, Order, OrderItem } from "@/lib/types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*, customers(*)").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  const typedOrder = order as Order & { customers: Customer | null };
  const orderItems = (items ?? []) as OrderItem[];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-medium">
              {typedOrder.order_number}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed{" "}
              {new Date(typedOrder.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <OrderStatusSelect orderId={typedOrder.id} status={typedOrder.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-none last:pb-0"
              >
                <div>
                  <p className="font-medium">
                    {item.quantity}&times; {item.name_snapshot}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">{item.notes}</p>
                  )}
                </div>
                <p className="shrink-0 font-medium">
                  {formatCents(item.price_cents_snapshot * item.quantity)}
                </p>
              </div>
            ))}

            <div className="space-y-1.5 pt-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCents(typedOrder.subtotal_cents)}</span>
              </div>
              {typedOrder.delivery_fee_cents > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery fee</span>
                  <span>{formatCents(typedOrder.delivery_fee_cents)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 font-heading text-base font-medium">
                <span>Total</span>
                <span>{formatCents(typedOrder.total_cents)}</span>
              </div>
            </div>

            {typedOrder.notes && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                &ldquo;{typedOrder.notes}&rdquo;
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{typedOrder.customers?.name ?? "—"}</p>
              {typedOrder.customers?.phone && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" /> {typedOrder.customers.phone}
                </p>
              )}
              {typedOrder.customers?.email && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" /> {typedOrder.customers.email}
                </p>
              )}
              {typedOrder.customers && (
                <Link
                  href={`/admin/customers/${typedOrder.customers.id}`}
                  className="inline-block pt-1 text-primary hover:underline"
                >
                  View customer
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="capitalize">
                {typedOrder.fulfillment_type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {typedOrder.fulfillment_type === "pickup" ? (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  Frisco Fresh Market &mdash;{" "}
                  {typedOrder.pickup_date
                    ? new Date(typedOrder.pickup_date).toLocaleDateString(
                        "en-US",
                        { weekday: "long", month: "short", day: "numeric" }
                      )
                    : "date not set"}
                </p>
              ) : (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  {typedOrder.delivery_address}, {typedOrder.delivery_city}{" "}
                  {typedOrder.delivery_zip}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentStatusToggle
                orderId={typedOrder.id}
                paymentStatus={typedOrder.payment_status}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Online payment isn&rsquo;t connected yet — mark orders paid
                once you&rsquo;ve collected payment on pickup or delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
