import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "./container";
import { NAV_LINKS, BUSINESS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-adinkra-cream/10 bg-adinkra-ink text-adinkra-cream">
      <Image
        src="/images/pattern.webp"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none select-none object-cover object-right opacity-[0.06]"
      />
      <Container className="relative py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Adinkra Fusion Kitchen"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="font-heading text-xl">
                Adinkra Fusion Kitchen
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-adinkra-cream-muted">
              Ghanaian and African fusion cuisine crafted by {BUSINESS.chef},
              blending heritage flavor with American technique &mdash;
              catering, nutritionist-guided meal plans, and weekend
              pickup across the DFW Metroplex.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-adinkra-gold">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-adinkra-cream-muted transition-colors hover:text-adinkra-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-adinkra-gold">
              Get in Touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-adinkra-cream-muted">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-adinkra-green" />
                <a
                  href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-adinkra-cream transition-colors"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-adinkra-green" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-adinkra-cream transition-colors break-all"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-adinkra-green" />
                <span>
                  Pickup at {BUSINESS.pickup.venue}, {BUSINESS.pickup.city}
                  <br />
                  {BUSINESS.pickup.schedule} &middot; delivery across{" "}
                  {BUSINESS.serviceArea}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-adinkra-cream/10 pt-8 text-xs text-adinkra-cream-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.operator}. All rights
            reserved.
          </p>
          <p>Crafted with laughter, great people, and amazing food.</p>
        </div>
      </Container>
    </footer>
  );
}
