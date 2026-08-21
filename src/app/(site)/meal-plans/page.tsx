import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Kicker } from "@/components/site/kicker";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/nav";
import { MEAL_PLAN_FEATURES, MEAL_PREP_GALLERY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meal Plans",
  description:
    "Nutritionist-guided meal plans from Adinkra Fusion Kitchen — fresh, flavorful, and built around your goals.",
};

export default function MealPlansPage() {
  return (
    <>
      <PageHero
        kicker="Meal Plans"
        title="Eat well without giving up flavor."
        description="Meal plans developed with medical nutritionists — fresh, heritage-forward, and built around how you want to feel."
      />

      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Kicker>Why It Works</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">
              Nutrition and flavor were never meant to compete.
            </h2>
            <p className="mt-6 text-adinkra-cream-muted leading-relaxed">
              {BUSINESS.chef} works directly with medical nutritionists to
              design plans that fit real dietary goals &mdash; without
              stripping out the bold, heritage flavor {BUSINESS.name} is
              known for. Pick your plan, and we handle the rest.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {MEAL_PREP_GALLERY.map((item) => (
                <div
                  key={item.image}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-adinkra-cream/10 bg-adinkra-ink-2/40 py-24 sm:py-32">
        <Container>
          <Reveal>
            <Kicker>What's Included</Kicker>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {MEAL_PLAN_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.06 * i}>
                <h3 className="font-heading text-xl font-medium">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-adinkra-cream-muted">
                  {f.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-medium sm:text-5xl">
              Ready to build your plan?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-adinkra-cream-muted">
              Our full menu is being finalized &mdash; place a plan inquiry
              now and we&rsquo;ll be in touch the moment it&rsquo;s live.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/order"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
                })}
              >
                View the Menu
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-12 rounded-full border-adinkra-cream/30 bg-transparent px-7 text-base text-adinkra-cream hover:bg-adinkra-cream/10 hover:text-adinkra-cream",
                })}
              >
                Ask a Question
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
