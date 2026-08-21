import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
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
  title: "Frisco Fresh Market",
  description:
    "Order Adinkra Fusion Kitchen's market menu online — cold salads, salsas, beverages, and pepper sauces, ready for pickup at Frisco Fresh Market.",
};

type PickupInfo = {
  venue: string;
  address: string;
  city: string;
  schedule: string;
  saturdayHours: string;
  sundayHours: string;
};

export default async function FriscoFreshMarketPage() {
  const supabase = await createClient();

  const { data: settingsRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["ordering_enabled", "pickup"]);

  const orderingEnabled = settingsRows?.find((s) => s.key === "ordering_enabled")?.value === true;
  const pickup = (settingsRows?.find((s) => s.key === "pickup")?.value ?? {
    venue: BUSINESS.pickup.venue,
    address: BUSINESS.pickup.address,
    city: BUSINESS.pickup.city,
    schedule: BUSINESS.pickup.schedule,
    saturdayHours: BUSINESS.pickup.saturdayHours,
    sundayHours: BUSINESS.pickup.sundayHours,
  }) as PickupInfo;

  const [{ data: categories }, { data: items }] = orderingEnabled
    ? await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .order("sort_order"),
      ])
    : [{ data: null }, { data: null }];

  const typedCategories = (categories ?? []) as MenuCategory[];
  const typedItems = (items ?? []) as MenuItem[];
  const canOrder = orderingEnabled && typedItems.length > 0;

  return (
    <>
      <PageHero
        kicker="Weekend Market"
        title="Find us at Frisco Fresh Market."
        description="Every Saturday and Sunday at the market table — or add items below and order online for pickup, pay-on-pickup, any day."
      />

      <section className="pb-20 sm:pb-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[1545/2000] w-full overflow-hidden rounded-3xl bg-adinkra-ink-2 ring-1 ring-adinkra-cream/10">
              <Image
                src="/images/menu-cold-salads-salsas-beverages.png"
                alt="Adinkra Fusion Kitchen market menu — cold salads, salsas, and beverages"
                fill
                className="object-contain"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>Where &amp; When</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">
              {pickup.venue}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
                <p className="text-adinkra-cream-muted">{MARKET_INFO.address}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="text-adinkra-cream-muted">
                  Sat {pickup.saturdayHours}
                </p>
                <p className="text-adinkra-cream-muted">
                  Sun {pickup.sundayHours}
                </p>
              </div>
            </div>
            <p className="mt-6 leading-relaxed text-adinkra-cream-muted">
              Everything on this page is made in small batches and sold fresh
              at the table. Add what you want to your cart and check out
              online &mdash; pickup only, pay when you get here.
            </p>
          </Reveal>
        </Container>
      </section>

      {canOrder ? (
        <CartProvider>
          <section className="pb-32">
            <Container>
              <Reveal>
                <Kicker>This Weekend&rsquo;s Table</Kicker>
                <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">
                  Add to your order.
                </h2>
              </Reveal>
              <div className="mt-12">
                <MenuBrowser categories={typedCategories} items={typedItems} />
              </div>
            </Container>
          </section>
          <CartDrawer pickup={pickup} />
        </CartProvider>
      ) : (
        <section className="pb-24 sm:pb-32">
          <Container className="text-center">
            <p className="text-adinkra-cream-muted">
              Online ordering isn&rsquo;t live yet &mdash; for now, find the
              full lineup fresh at the table this weekend, or{" "}
              <Link
                href="/contact"
                className="text-adinkra-gold underline underline-offset-4"
              >
                reach out
              </Link>{" "}
              with questions.
            </p>
          </Container>
        </section>
      )}
    </>
  );
}
