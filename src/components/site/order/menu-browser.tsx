"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";
import type { MenuCategory, MenuItem } from "@/lib/types";

export function MenuBrowser({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  const cart = useCart();
  const uncategorized = items.filter((i) => !i.category_id);

  const groups = [
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      items: items.filter((i) => i.category_id === c.id),
    })),
    ...(uncategorized.length
      ? [{ id: "uncategorized", name: "More", items: uncategorized }]
      : []),
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <div key={group.id}>
          <h2 className="font-heading text-2xl font-medium">{group.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl bg-adinkra-ink-2/50 p-4 ring-1 ring-adinkra-cream/10"
              >
                {item.image_url && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-adinkra-ink">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-medium">{item.name}</h3>
                    <span className="shrink-0 font-medium text-adinkra-gold">
                      {formatCents(item.price_cents)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-adinkra-cream-muted">
                      {item.description}
                    </p>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-auto w-fit self-start border-adinkra-cream/20 bg-transparent text-adinkra-cream hover:bg-adinkra-cream/10 hover:text-adinkra-cream"
                    onClick={() =>
                      cart.add({
                        menuItemId: item.id,
                        name: item.name,
                        priceCents: item.price_cents,
                        imageUrl: item.image_url,
                      })
                    }
                  >
                    <Plus className="size-3.5" /> Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
