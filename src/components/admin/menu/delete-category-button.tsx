"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/admin/(dashboard)/menu/actions";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Delete category"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Delete "${categoryName}"? Items in this category will become uncategorized.`
          )
        )
          return;
        startTransition(async () => {
          try {
            await deleteCategory(categoryId);
            toast.success("Category deleted");
          } catch {
            toast.error("Couldn't delete category.");
          }
        });
      }}
    >
      <Trash2 className="size-3.5 text-destructive" />
    </Button>
  );
}
