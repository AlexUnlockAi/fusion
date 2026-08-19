import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { CustomerNotes } from "@/components/admin/customer-notes";
import { formatCents } from "@/lib/money";
import type { Customer, Order } from "@/lib/types";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: orders }] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("orders")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!customer) notFound();

  const typedCustomer = customer as Customer;
  const typedOrders = (orders ?? []) as Order[];
  const lifetimeValue = typedOrders.reduce((sum, o) => sum + o.total_cents, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to customers
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-medium">
          {typedCustomer.name}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {typedOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {typedOrders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 hover:border-primary/40"
                    >
                      <div>
                        <p className="font-medium text-primary">
                          {order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}{" "}
                          &middot; {order.fulfillment_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <span className="font-medium">
                          {formatCents(order.total_cents)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {typedCustomer.phone && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" /> {typedCustomer.phone}
                </p>
              )}
              {typedCustomer.email && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" /> {typedCustomer.email}
                </p>
              )}
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs text-muted-foreground">Lifetime value</p>
                <p className="font-heading text-lg font-medium">
                  {formatCents(lifetimeValue)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerNotes
                customerId={typedCustomer.id}
                initialNotes={typedCustomer.notes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
