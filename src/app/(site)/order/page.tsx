import type { Metadata } from "next";
import { ChefHat, MapPin, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/site/container";
import { Kicker } from "@/components/site/kicker";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { CartProvider } from "@/lib/cart-context";
import { MenuBrowser } from "@/components/site/order/menu-browser";
import { CartDrawer } from "@/components/site/order/cart-drawer";
import { BUSINESS } from "@/lib/nav";
import type { MenuCategory, MenuItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Order from Adinkra Fusion Kitchen — weekend pickup at Frisco Fresh Market or delivery across the DFW Metroplex.",
};

type PickupInfo = { venue: string; city: string; schedule: string; hours: string };
type DeliveryInfo = { area: string; fee_cents: number; minimum_cents: number };

export default async function OrderPage() {
  const supabase = await createClient();

  const { data: settingsRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["ordering_enabled", "pickup", "delivery"]);

  const orderingEnabled = settingsRows?.find((s) => s.key === "ordering_enabled")?.value === true;
  const pickup = (settingsRows?.find((s) => s.key === "pickup")?.value ?? {
    venue: BUSINESS.pickup.venue,
    city: BUSINESS.pickup.city,
    schedule: BUSINESS.pickup.schedule,
    hours: "10:00 AM – 4:00 PM",
  }) as PickupInfo;
  const delivery = (settingsRows?.find((s) => s.key === "delivery")?.value ?? {
    area: BUSINESS.serviceArea,
    fee_cents: 800,
    minimum_cents: 0,
  }) as DeliveryInfo;

  if (!orderingEnabled) {
    return <ComingSoon pickup={pickup} delivery={delivery} />;
  }

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("sort_order"),
  ]);

  const typedCategories = (categories ?? []) as MenuCategory[];
  const typedItems = (items ?? []) as MenuItem[];

  if (typedItems.length === 0) {
    return <ComingSoon pickup={pickup} delivery={delivery} />;
  }

  return (
    <CartProvider>
      <PageHero
        kicker="Order"
        title="Build your order."
        description={`Pickup at ${pickup.venue} (${pickup.schedule.toLowerCase()}) or delivery across ${delivery.area}.`}
      />
      <section className="pb-32">
        <Container>
          <MenuBrowser categories={typedCategories} items={typedItems} />
        </Container>
      </section>
      <CartDrawer pickup={pickup} delivery={delivery} />
    </CartProvider>
  );
}

function ComingSoon({
  pickup,
  delivery,
}: {
  pickup: PickupInfo;
  delivery: DeliveryInfo;
}) {
  return (
    <>
      <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Kicker className="justify-center">Order</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-heading text-5xl font-medium sm:text-6xl">
            Menu coming soon.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-md text-lg text-adinkra-cream-muted">
            We&rsquo;re putting the finishing touches on the {BUSINESS.name}{" "}
            menu. Check back soon, or reach out if you have a question in the
            meantime.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-adinkra-ink-2/60 p-6 text-left ring-1 ring-adinkra-cream/10">
              <MapPin className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
              <div>
                <p className="font-heading font-medium">Weekend Pickup</p>
                <p className="mt-1 text-sm text-adinkra-cream-muted">
                  {pickup.venue}, {pickup.city} &mdash; {pickup.schedule}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-adinkra-ink-2/60 p-6 text-left ring-1 ring-adinkra-cream/10">
              <Truck className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
              <div>
                <p className="font-heading font-medium">DFW Delivery</p>
                <p className="mt-1 text-sm text-adinkra-cream-muted">
                  Across {delivery.area}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-10 flex items-center gap-2 text-sm text-adinkra-cream-muted">
            <ChefHat className="size-4 text-adinkra-gold" />
            Crafted by {BUSINESS.chef}
          </div>
        </Reveal>
      </section>
    </>
  );
}
