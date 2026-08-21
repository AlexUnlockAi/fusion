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
import { VALUES } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Chef Eric of Adinkra Fusion Kitchen — Ghanaian and African fusion cuisine rooted in heritage, community, and nutrition.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title="Meet Chef Eric."
        description="The chef, the philosophy, and the kitchen behind Adinkra Fusion Kitchen."
      />

      <section className="py-24 sm:py-32">
        <Container className="grid items-start gap-14 lg:grid-cols-[0.85fr_1fr]">
          <Reveal>
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
                <Image
                  src="/images/chef-eric-african-print.jpeg"
                  alt="Chef Eric, founder of Adinkra Fusion Kitchen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/gallery/chef-serving-event.jpeg"
                  alt="Chef Eric serving at a catered event"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Kicker>The Philosophy</Kicker>
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl">
              &ldquo;Laughter, great people, and amazing food without
              compromise.&rdquo;
            </h2>
            <div className="mt-8 space-y-5 text-adinkra-cream-muted leading-relaxed">
              <p>
                {BUSINESS.chef} founded {BUSINESS.name}, operating under{" "}
                {BUSINESS.operator}, to bring Ghanaian and West African
                flavor to the DFW table &mdash; not as a novelty, but as a
                full culinary tradition, built dish by dish with American
                technique and precision.
              </p>
              <p>
                What started as cooking for friends and church fundraisers
                has grown into full-scale corporate and private catering,
                alongside nutritionist-guided meal delivery for clients who
                want food that tastes incredible and does right by their
                body. Every menu is built the same way: fresh ingredients,
                bold heritage flavor, and zero shortcuts.
              </p>
              <p>
                Today, Chef Eric and the {BUSINESS.name} team serve{" "}
                {BUSINESS.serviceArea} &mdash; from weekend pickup at{" "}
                {BUSINESS.pickup.venue} in {BUSINESS.pickup.city} to
                delivery across the metroplex.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title}>
                  <h3 className="font-heading text-lg font-medium">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-adinkra-cream-muted">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/catering"
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-12 h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
              })}
            >
              Explore Catering
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
