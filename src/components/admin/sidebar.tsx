"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-6 py-5">
        <Image
          src="/images/logo.png"
          alt="Adinkra Fusion Kitchen"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="leading-tight">
          <p className="font-heading text-sm font-medium">Adinkra Fusion</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname?.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="border-t border-sidebar-border p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
