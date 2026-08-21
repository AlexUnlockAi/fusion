import Link from "next/link";
import { MapPin } from "lucide-react";
import { MARKET_INFO } from "@/lib/content";

export function MarketBanner() {
  return (
    <div className="bg-adinkra-gold text-adinkra-ink">
      <Link
        href="/frisco-fresh-market"
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-xs font-semibold sm:text-sm"
      >
        <MapPin className="size-3.5 shrink-0" />
        <span>
          This weekend: Chef Eric is at Frisco Fresh Market — Sat 8AM–4PM
          &amp; Sun 10AM–4PM, {MARKET_INFO.address}
        </span>
      </Link>
    </div>
  );
}
