import { cn } from "@/lib/utils";

export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-adinkra-gold",
        className
      )}
    >
      <span className="h-px w-8 bg-adinkra-gold/60" />
      {children}
    </div>
  );
}
