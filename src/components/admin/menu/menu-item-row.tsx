"use client";

import { useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MenuItemDialog } from "./menu-item-dialog";
import {
  deleteMenuItem,
  toggleItemAvailability,
} from "@/app/admin/(dashboard)/menu/actions";
import { formatCents } from "@/lib/money";
import type { MenuCategory, MenuItem } from "@/lib/types";

export function MenuItemRow({
  item,
  categories,
}: {
  item: MenuItem;
  categories: MenuCategory[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-none">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.image_url && (
          <Image src={item.image_url} alt="" fill className="object-cover" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.name}</p>
        {item.description && (
          <p className="truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>

      <p className="w-20 shrink-0 text-right font-medium">
        {formatCents(item.price_cents)}
      </p>

      <Switch
        checked={item.is_available}
        disabled={pending}
        onCheckedChange={(value) => {
          startTransition(async () => {
            try {
              await toggleItemAvailability(item.id, value);
            } catch {
              toast.error("Couldn't update availability.");
            }
          });
        }}
      />

      <MenuItemDialog item={item} categories={categories} />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Delete item"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
          startTransition(async () => {
            try {
              await deleteMenuItem(item.id);
              toast.success("Item deleted");
            } catch {
              toast.error("Couldn't delete the item.");
            }
          });
        }}
      >
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  );
}
