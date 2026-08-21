import type { Metadata } from "next";
import Image from "next/image";
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
import { MARKET_INFO } from "@/lib/content";
import type { MenuCategory, MenuItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Order from Adinkra Fusion Kitchen — weekend pickup at Frisco Fresh Market or delivery across the DFW Metroplex.",
};

type PickupInfo = {
  venue: string;
  address: string;
  city: string;
  schedule: string;
  saturdayHours: string;
  sundayHours: string;
};
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
    address: BUSINESS.pickup.address,
    city: BUSINESS.pickup.city,
    schedule: BUSINESS.pickup.schedule,
    saturdayHours: BUSINESS.pickup.saturdayHours,
    sundayHours: BUSINESS.pickup.sundayHours,
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
        description={`Pickup at ${pickup.venue} (${pickup.schedule}) or delivery across ${delivery.area}.`}
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
      <section className="flex flex-col items-center px-6 pb-20 pt-40 text-center">
        <Reveal>
          <Kicker className="justify-center">Order</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-heading text-5xl font-medium sm:text-6xl">
            Menu coming soon online &mdash;
            <br className="hidden sm:block" /> but find us in person this
            weekend.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-md text-lg text-adinkra-cream-muted">
            We&rsquo;re putting the finishing touches on online ordering.
            Until then, {BUSINESS.chef} will be at {MARKET_INFO.headline.replace("This weekend: find us at ", "")}.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative mt-10 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
            <Image
              src="/images/weekend-flyer.png"
              alt="This weekend at Frisco Fresh Market flyer"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-adinkra-ink-2/60 p-6 text-left ring-1 ring-adinkra-cream/10">
              <MapPin className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
              <div>
                <p className="font-heading font-medium">Weekend Pickup</p>
                <p className="mt-1 text-sm text-adinkra-cream-muted">
                  {pickup.venue}, {pickup.address}
                  <br />
                  Sat {pickup.saturdayHours} &middot; Sun {pickup.sundayHours}
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

        <Reveal delay={0.36}>
          <div className="mt-10 flex items-center gap-2 text-sm text-adinkra-cream-muted">
            <ChefHat className="size-4 text-adinkra-gold" />
            Crafted by {BUSINESS.chef}
          </div>
        </Reveal>
      </section>
    </>
  );
}
