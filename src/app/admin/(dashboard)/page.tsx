import Link from "next/link";
import { ArrowRight, Clock, DollarSign, MessageSquareText, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCents } from "@/lib/money";
import type { Order } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [ordersRes, pendingRes, inquiriesRes, settingsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("orders")
      .select("id, total_cents, created_at, status")
      .in("status", ["new", "preparing", "ready", "out_for_delivery"]),
    supabase.from("inquiries").select("id").eq("status", "new"),
    supabase.from("settings").select("key, value").eq("key", "ordering_enabled").maybeSingle(),
  ]);

  const recentOrders = (ordersRes.data ?? []) as Order[];
  const pendingOrders = pendingRes.data ?? [];
  const todaysOrders = pendingOrders.filter(
    (o) => new Date(o.created_at) >= startOfToday
  );
  const todaysRevenue = (ordersRes.data ?? [])
    .filter((o) => new Date(o.created_at) >= startOfToday)
    .reduce((sum, o) => sum + o.total_cents, 0);
  const newInquiries = inquiriesRes.data?.length ?? 0;
  const orderingEnabled = settingsRes.data?.value === true;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-medium">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of today at Adinkra Fusion Kitchen.
        </p>
      </div>

      {!orderingEnabled && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Online ordering is currently <strong>off</strong> &mdash;
            customers see &ldquo;Menu Coming Soon.&rdquo; Add items and flip
            it on in Menu settings when you&rsquo;re ready.
          </span>
          <Link
            href="/admin/menu"
            className="inline-flex shrink-0 items-center gap-1 font-medium text-amber-900 underline underline-offset-2"
          >
            Go to Menu <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Pending Orders"
          value={String(pendingOrders.length)}
        />
        <StatCard
          icon={Clock}
          label="Today's Orders"
          value={String(todaysOrders.length)}
        />
        <StatCard
          icon={DollarSign}
          label="Today's Revenue"
          value={formatCents(todaysRevenue)}
        />
        <StatCard
          icon={MessageSquareText}
          label="New Inquiries"
          value={String(newInquiries)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {order.fulfillment_type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCents(order.total_cents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-heading text-xl font-medium">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
