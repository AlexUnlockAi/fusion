"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/app/admin/(dashboard)/menu/actions";

export function CategoryQuickAdd() {
  const ref = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={ref}
      className="flex items-center gap-2"
      action={(formData) => {
        const name = String(formData.get("name") ?? "").trim();
        if (!name) return;
        startTransition(async () => {
          try {
            await createCategory(name);
            ref.current?.reset();
            toast.success(`Added category "${name}"`);
          } catch {
            toast.error("Couldn't add category.");
          }
        });
      }}
    >
      <Input name="name" placeholder="New category name…" className="w-56" />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        <Plus className="size-4" /> Add Category
      </Button>
    </form>
  );
}
