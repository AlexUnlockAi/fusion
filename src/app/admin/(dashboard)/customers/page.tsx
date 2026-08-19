import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer } from "@/lib/types";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("customers")
    .select("*, orders(id)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data } = await query;
  const customers = (data ?? []) as (Customer & { orders: { id: string }[] })[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who has ordered or reached out.
        </p>
      </div>

      <form className="max-w-sm">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, email, or phone…"
        />
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {customers.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No customers yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.email ?? c.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.orders?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
