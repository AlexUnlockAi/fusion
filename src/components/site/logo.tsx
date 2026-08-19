import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 shrink-0",
        className
      )}
    >
      <Image
        src="/images/logo.png"
        alt="Adinkra Fusion Kitchen"
        width={44}
        height={44}
        className="rounded-full ring-1 ring-adinkra-cream/15"
        priority
      />
      <span className="font-heading text-lg leading-tight tracking-tight text-current hidden sm:block">
        Adinkra
        <span className="block text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-adinkra-gold uppercase">
          Fusion Kitchen
        </span>
      </span>
    </Link>
  );
}
