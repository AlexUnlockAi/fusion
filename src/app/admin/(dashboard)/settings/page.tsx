import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PickupSettingsForm, DeliverySettingsForm } from "@/components/admin/settings-forms";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["pickup", "delivery"]);

  const pickup = (data?.find((s) => s.key === "pickup")?.value ?? {
    venue: "Frisco Fresh Market",
    address: "9200 Dallas Parkway",
    city: "Frisco, TX 75033",
    schedule: "Saturdays & Sundays",
    saturdayHours: "8:00 AM – 4:00 PM",
    sundayHours: "10:00 AM – 4:00 PM",
  }) as {
    venue: string;
    address: string;
    city: string;
    schedule: string;
    saturdayHours: string;
    sundayHours: string;
  };

  const delivery = (data?.find((s) => s.key === "delivery")?.value ?? {
    area: "DFW Metroplex",
    fee_cents: 800,
    minimum_cents: 0,
  }) as { area: string; fee_cents: number; minimum_cents: number };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Pickup and delivery details shown to customers on the Order page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekend Pickup</CardTitle>
        </CardHeader>
        <CardContent>
          <PickupSettingsForm initial={pickup} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DFW Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliverySettingsForm initial={delivery} />
        </CardContent>
      </Card>
    </div>
  );
}
