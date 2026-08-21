"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, ShoppingCart } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "./container";
import { FacebookIcon, InstagramIcon } from "./social-icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, BUSINESS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-adinkra-cream/10 bg-adinkra-ink/90 backdrop-blur-md">
      <Container className="flex h-20 max-w-[90rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden 2xl:flex items-center gap-5 font-heading text-[0.75rem] font-medium uppercase">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            const isMarket = link.href === "/frisco-fresh-market";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  isMarket
                    ? "text-adinkra-green hover:text-adinkra-green/80"
                    : active
                      ? "text-adinkra-gold"
                      : "text-adinkra-cream hover:text-adinkra-gold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
            className="hidden 2xl:flex items-center gap-2 text-sm text-adinkra-cream-muted hover:text-adinkra-gold transition-colors"
          >
            <Phone className="size-3.5" />
            {BUSINESS.phone}
          </a>

          <div className="hidden items-center gap-3 sm:flex">
            <a
              href={`https://instagram.com/${BUSINESS.instagram}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-adinkra-cream-muted transition-colors hover:text-adinkra-gold"
            >
              <InstagramIcon className="size-[18px]" />
            </a>
            <a
              href={`https://facebook.com/${BUSINESS.facebook}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-adinkra-cream-muted transition-colors hover:text-adinkra-gold"
            >
              <FacebookIcon className="size-[18px]" />
            </a>
          </div>

          <Link
            href="/order"
            aria-label="Order online"
            className="hidden sm:flex size-8 items-center justify-center rounded-lg text-adinkra-cream transition-colors hover:text-adinkra-gold"
          >
            <ShoppingCart className="size-5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="2xl:hidden border-adinkra-cream/20 bg-transparent hover:bg-adinkra-cream/10 hover:text-adinkra-gold"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton
              className="w-full sm:max-w-full border-none bg-adinkra-ink p-0 text-adinkra-cream"
            >
              <SheetTitle className="sr-only">Site menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate to a page on the Adinkra Fusion Kitchen website
              </SheetDescription>

              <div className="flex h-full flex-col justify-between px-6 py-10 sm:px-16 sm:py-16">
                <div className="flex items-center justify-between">
                  <Logo className="text-adinkra-cream" />
                </div>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-baseline gap-4 border-b border-adinkra-cream/10 py-4 font-heading text-4xl sm:text-6xl transition-colors",
                          active
                            ? "text-adinkra-gold"
                            : "text-adinkra-cream hover:text-adinkra-gold"
                        )}
                        style={{ transitionDelay: `${i * 20}ms` }}
                      >
                        <span className="font-sans text-xs text-adinkra-cream-muted tabular-nums">
                          0{i + 1}
                        </span>
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <a
                      href={`https://instagram.com/${BUSINESS.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="text-adinkra-cream-muted transition-colors hover:text-adinkra-gold"
                    >
                      <InstagramIcon className="size-5" />
                    </a>
                    <a
                      href={`https://facebook.com/${BUSINESS.facebook}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="text-adinkra-cream-muted transition-colors hover:text-adinkra-gold"
                    >
                      <FacebookIcon className="size-5" />
                    </a>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-adinkra-cream-muted sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="hover:text-adinkra-gold transition-colors"
                    >
                      {BUSINESS.email}
                    </a>
                    <a
                      href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                      className="hover:text-adinkra-gold transition-colors"
                    >
                      {BUSINESS.phone}
                    </a>
                    <span>{BUSINESS.serviceArea}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
