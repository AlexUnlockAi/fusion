import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/site/container";
import { Kicker } from "@/components/site/kicker";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { CATERING_PROCESS, CATERING_TYPES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Corporate and private catering from Adinkra Fusion Kitchen — custom menus for events across the DFW Metroplex.",
};

export default function CateringPage() {
  return (
    <>
      <PageHero
        kicker="Catering"
        title="Catering that feels like an event, not a vendor drop-off."
        description="From boardrooms to backyards, Chef Eric builds a custom menu around your event and cooks it fresh."
      />

      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-adinkra-ink-2">
              <Image
                src="/images/gallery/catering-poke-cups.jpeg"
                alt="Ahi poke cups plated for a catering event"
                fill
                className="object-contain"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>What We Cater</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">
              Every table, every occasion.
            </h2>
            <ul className="mt-8 space-y-4">
              {CATERING_TYPES.map((type) => (
                <li key={type} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-adinkra-green/20 text-adinkra-green">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-adinkra-cream-muted">{type}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/events"
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-10 h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
              })}
            >
              Start an Event Inquiry
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-adinkra-cream/10 bg-adinkra-ink-2/40 py-24 sm:py-32">
        <Container>
          <Reveal>
            <Kicker>How It Works</Kicker>
            <h2 className="mt-4 max-w-lg font-heading text-3xl font-medium sm:text-4xl">
              From inquiry to a table your guests remember.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {CATERING_PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={0.08 * i}>
                <span className="font-heading text-5xl text-adinkra-gold/40">
                  {step.step}
                </span>
                <h3 className="mt-4 font-heading text-xl font-medium">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-adinkra-cream-muted">
                  {step.body}
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
              Planning something?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-adinkra-cream-muted">
              Tell us about your event and we&rsquo;ll build a menu around
              it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/events"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
                })}
              >
                Start an Event Inquiry
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
                Contact Us
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
