import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PickupSettingsForm } from "@/components/admin/settings-forms";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .eq("key", "pickup")
    .maybeSingle();

  const pickup = (data?.value ?? {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Pickup details shown to customers on the Order page. Pickup only
          &mdash; no delivery.
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
    </div>
  );
}
