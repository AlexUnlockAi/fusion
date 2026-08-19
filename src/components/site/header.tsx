"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "./container";
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
            className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-adinkra-gold transition-colors"
          >
            <Phone className="size-3.5" />
            {BUSINESS.phone}
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="border-adinkra-cream/20 bg-transparent hover:bg-adinkra-cream/10 hover:text-adinkra-gold"
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
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
