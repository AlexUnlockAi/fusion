import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents } from "@/lib/money";
import { ORDER_STATUS_LABELS, type Order, type OrderItem, type OrderStatus } from "@/lib/types";

export default async function ReportsPage() {
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: orders }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*"),
    supabase.from("order_items").select("*"),
  ]);

  const typedOrders = (orders ?? []) as Order[];
  const typedItems = (items ?? []) as OrderItem[];

  const completed = typedOrders.filter((o) => o.status === "completed");
  const lifetimeRevenue = completed.reduce((sum, o) => sum + o.total_cents, 0);
  const monthRevenue = completed
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + o.total_cents, 0);
  const avgOrderValue = completed.length
    ? Math.round(lifetimeRevenue / completed.length)
    : 0;

  const statusCounts = typedOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const itemTotals = new Map<string, { quantity: number; revenue: number }>();
  for (const item of typedItems) {
    const key = item.name_snapshot;
    const existing = itemTotals.get(key) ?? { quantity: 0, revenue: 0 };
    existing.quantity += item.quantity;
    existing.revenue += item.price_cents_snapshot * item.quantity;
    itemTotals.set(key, existing);
  }
  const topItems = [...itemTotals.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Revenue and order performance, based on completed orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">Lifetime Revenue</p>
            <p className="font-heading text-2xl font-medium">
              {formatCents(lifetimeRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="font-heading text-2xl font-medium">
              {formatCents(monthRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
            <p className="font-heading text-2xl font-medium">
              {formatCents(avgOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {ORDER_STATUS_LABELS[status]}
                </span>
                <span className="font-medium">{statusCounts[status] ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
          </CardHeader>
          <CardContent>
            {topItems.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No sales data yet.
              </p>
            ) : (
              <div className="space-y-2">
                {topItems.map(([name, stats]) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span>
                      {name}{" "}
                      <span className="text-muted-foreground">&times;{stats.quantity}</span>
                    </span>
                    <span className="font-medium">{formatCents(stats.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
