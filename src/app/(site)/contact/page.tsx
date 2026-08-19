import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { BUSINESS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Adinkra Fusion Kitchen.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Let's talk."
        description="Questions about catering, meal plans, or an order? Send a message and we'll follow up soon."
      />

      <section className="pb-24 sm:pb-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <ul className="space-y-6 text-adinkra-cream-muted">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
                <a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`} className="hover:text-adinkra-cream">
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-adinkra-cream break-all">
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-adinkra-gold" />
                <span>
                  Pickup at {BUSINESS.pickup.venue}, {BUSINESS.pickup.city}
                  <br />
                  Delivering across {BUSINESS.serviceArea}
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
