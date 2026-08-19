"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  MessageSquareText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="icon" aria-label="Open menu" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Admin menu</SheetTitle>
        <nav className="flex flex-col gap-1 p-4">
          {LINKS.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <form action={logout} className="mt-2 border-t border-border pt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
