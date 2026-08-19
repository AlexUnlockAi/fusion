import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import type { Inquiry } from "@/lib/types";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const inquiries = (data ?? []) as Inquiry[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Inquiries</h1>
        <p className="text-sm text-muted-foreground">
          Contact messages and event inquiries from the website.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No inquiries yet.
        </p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <Card key={inq.id}>
              <CardContent className="space-y-3 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{inq.name}</p>
                      <Badge variant={inq.type === "event" ? "default" : "secondary"}>
                        {inq.type === "event" ? "Event" : "Contact"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inq.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <InquiryStatusSelect id={inq.id} status={inq.status} />
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                  {inq.email && <span>{inq.email}</span>}
                  {inq.phone && <span>{inq.phone}</span>}
                  {inq.event_type && <span>Event: {inq.event_type}</span>}
                  {inq.event_date && (
                    <span>
                      Date:{" "}
                      {new Date(inq.event_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {inq.guest_count && <span>Guests: {inq.guest_count}</span>}
                </div>

                {inq.message && (
                  <p className="rounded-lg bg-muted p-3 text-sm">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
