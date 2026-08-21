import { Leaf, Flame, Landmark, Heart } from "lucide-react";

const BADGES = [
  { icon: Leaf, label: "Fresh Ingredients" },
  { icon: Flame, label: "Bold Flavors" },
  { icon: Landmark, label: "Cultural Heritage" },
  { icon: Heart, label: "Made with Love" },
];

export function TrustBadges() {
  return (
    <div className="bg-adinkra-green-deep">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-4 px-6 py-5 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-adinkra-cream/10 lg:px-8">
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-2 sm:justify-center sm:px-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-adinkra-gold">
              <Icon className="size-4 text-adinkra-gold" />
            </span>
            <span className="font-heading text-xs font-semibold uppercase tracking-wide text-adinkra-cream">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
