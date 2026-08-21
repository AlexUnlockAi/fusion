import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Quote, Truck } from "lucide-react";
import { Container } from "@/components/site/container";
import { Kicker } from "@/components/site/kicker";
import { Reveal } from "@/components/site/reveal";
import { TrustBadges } from "@/components/site/trust-badges";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/nav";
import { GALLERY, MARKET_INFO, SPECIALTIES, TESTIMONIALS } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Chef Eric plating a fusion dish"
          fill
          priority
          className="object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-adinkra-ink via-adinkra-ink/70 to-adinkra-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-adinkra-ink/60 via-transparent to-transparent" />

        <Container className="relative pb-20 pt-40 sm:pb-28">
          <Reveal>
            <Kicker>Ghanaian &amp; African Fusion &middot; DFW Metroplex</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-5 font-script text-2xl leading-tight sm:text-3xl">
              <span className="block text-adinkra-gold">Bold Flavors.</span>
              <span className="block text-adinkra-gold">Fresh Ingredients.</span>
              <span className="block text-adinkra-cream">
                Made with Culture.
              </span>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-4 max-w-3xl font-headline text-5xl leading-[0.95] uppercase tracking-tight text-adinkra-cream sm:text-7xl">
              Real Flavor.
              <br />
              Rooted in Culture.
            </h1>
            <span className="mt-6 flex items-center gap-2" aria-hidden>
              <span className="size-2 rounded-full bg-adinkra-red" />
              <span className="size-2 rounded-full bg-adinkra-gold" />
              <span className="size-2 rounded-full bg-adinkra-gold" />
              <span className="size-2 rounded-full bg-adinkra-green" />
            </span>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-xl text-lg text-adinkra-cream-muted">
              {BUSINESS.chef} blends bold flavors, fresh ingredients, and
              cultural heritage into unforgettable dishes &mdash; corporate
              &amp; private catering, nutritionist-guided meal plans, and
              weekend pickup across the DFW Metroplex.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/order"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-lg bg-adinkra-green px-7 font-heading text-base uppercase tracking-wide text-adinkra-cream hover:bg-adinkra-green/90",
                })}
              >
                View Menu
              </Link>
              <Link
                href="/order"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-lg bg-adinkra-gold px-7 font-heading text-base uppercase tracking-wide text-adinkra-ink hover:bg-adinkra-gold/90",
                })}
              >
                Shop Pepper Sauces
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <TrustBadges />

      {/* This Weekend */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <Kicker>Find Us This Weekend</Kicker>
            <h2 className="mt-4 font-heading text-4xl font-medium sm:text-5xl">
              {MARKET_INFO.headline}
            </h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
                <div>
                  <p className="font-medium text-adinkra-cream">
                    {BUSINESS.pickup.venue}
                  </p>
                  <p className="text-sm text-adinkra-cream-muted">
                    {MARKET_INFO.address}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <p className="text-adinkra-cream-muted">{MARKET_INFO.saturday}</p>
                <p className="text-adinkra-cream-muted">{MARKET_INFO.sunday}</p>
              </div>
            </div>
            <p className="mt-6 font-heading italic text-adinkra-gold">
              {MARKET_INFO.tagline}
            </p>
            <Link
              href="/contact"
              className={buttonVariants({
                size: "lg",
                className:
                  "mt-8 h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
              })}
            >
              Get Directions &amp; Say Hi
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-[1024/1536] w-full max-w-sm overflow-hidden rounded-3xl bg-adinkra-ink-2 shadow-2xl shadow-black/40">
              <Image
                src="/images/weekend-flyer.png"
                alt="This weekend at Frisco Fresh Market flyer"
                fill
                className="object-contain"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Our Specialty */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Kicker>Our Specialty</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-medium sm:text-5xl">
              Cooking with intention, plated with care.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {SPECIALTIES.map((item, i) => (
              <Reveal key={item.title} delay={0.08 * i}>
                <div className="group">
                  <div className="relative flex size-16 items-center justify-center rounded-2xl bg-adinkra-cream/5 ring-1 ring-adinkra-cream/10">
                    <Image
                      src={item.image}
                      alt=""
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-adinkra-cream-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="border-y border-adinkra-cream/10 bg-adinkra-ink-2/40 py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-adinkra-ink-2">
              <Image
                src="/images/chef-eric-blue-coat.jpeg"
                alt="Chef Eric, founder of Adinkra Fusion Kitchen"
                fill
                className="object-contain"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Kicker>Our Story</Kicker>
            <h2 className="mt-4 font-heading text-4xl font-medium sm:text-5xl">
              Two traditions, one table.
            </h2>
            <p className="mt-6 text-adinkra-cream-muted leading-relaxed">
              Adinkra Fusion Kitchen blends Ghanaian and African flavors with
              American culinary technique &mdash; food that feels like home,
              wherever home is. {BUSINESS.chef} leads corporate and private
              catering alongside nutritionist-guided meal delivery, cooking
              for churches, offices, and families across{" "}
              {BUSINESS.serviceArea}.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-heading text-adinkra-gold hover:gap-3 transition-all"
            >
              Meet Chef Eric <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Gallery strip */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Kicker>The Table</Kicker>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {GALLERY.map((item, i) => (
              <Reveal key={item.image} delay={0.06 * i}>
                <div
                  className={`relative overflow-hidden rounded-2xl bg-adinkra-ink-2 ${
                    i === 1 ? "aspect-[3/4] sm:mt-8" : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Service area / order */}
      <section className="border-y border-adinkra-cream/10 bg-adinkra-green-deep/40 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <Kicker>Service Area</Kicker>
              <h2 className="mt-4 font-heading text-4xl font-medium sm:text-5xl">
                Serving {BUSINESS.serviceArea}.
              </h2>
              <p className="mt-6 text-adinkra-cream-muted leading-relaxed max-w-lg">
                We work directly with nutritionists and clients alike &mdash;
                from weekly meal plans to full-scale event catering.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal delay={0.08}>
                <div className="h-full rounded-2xl bg-adinkra-ink/60 p-7 ring-1 ring-adinkra-cream/10">
                  <MapPin className="size-6 text-adinkra-gold" />
                  <h3 className="mt-4 font-heading text-lg font-medium">
                    Weekend Pickup
                  </h3>
                  <p className="mt-2 text-sm text-adinkra-cream-muted">
                    {BUSINESS.pickup.venue}, {BUSINESS.pickup.city}
                    <br />
                    Sat {BUSINESS.pickup.saturdayHours} &middot; Sun{" "}
                    {BUSINESS.pickup.sundayHours}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="h-full rounded-2xl bg-adinkra-ink/60 p-7 ring-1 ring-adinkra-cream/10">
                  <Truck className="size-6 text-adinkra-gold" />
                  <h3 className="mt-4 font-heading text-lg font-medium">
                    DFW Delivery
                  </h3>
                  <p className="mt-2 text-sm text-adinkra-cream-muted">
                    Delivered across the DFW Metroplex &mdash; place your
                    order online once the menu is live.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Kicker>What People Are Saying</Kicker>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={0.08 * i}>
                <figure className="flex h-full flex-col rounded-2xl bg-adinkra-ink-2/60 p-7 ring-1 ring-adinkra-cream/10">
                  <Quote className="size-6 text-adinkra-gold" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-adinkra-cream-muted">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 font-heading text-adinkra-cream">
                    {t.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Image
          src="/images/pattern.webp"
          alt=""
          fill
          aria-hidden
          className="pointer-events-none select-none object-cover opacity-[0.08]"
        />
        <Container className="relative text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-medium sm:text-5xl">
              Ready to taste the fusion?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-md text-adinkra-cream-muted">
              Meal plans, catering, and events &mdash; let&rsquo;s put
              something amazing on your table.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/meal-plans"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 rounded-full bg-adinkra-gold px-7 text-base text-adinkra-ink hover:bg-adinkra-gold/90",
                })}
              >
                Discover Delicious Plans
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
                Reach Out to Us
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
