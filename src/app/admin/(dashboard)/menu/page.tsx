import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderingToggle } from "@/components/admin/menu/ordering-toggle";
import { CategoryQuickAdd } from "@/components/admin/menu/category-quick-add";
import { DeleteCategoryButton } from "@/components/admin/menu/delete-category-button";
import { MenuItemDialog } from "@/components/admin/menu/menu-item-dialog";
import { MenuItemRow } from "@/components/admin/menu/menu-item-row";
import type { MenuCategory, MenuItem } from "@/lib/types";

export default async function MenuPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }, { data: setting }] =
    await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
      supabase
        .from("settings")
        .select("value")
        .eq("key", "ordering_enabled")
        .maybeSingle(),
    ]);

  const typedCategories = (categories ?? []) as MenuCategory[];
  const typedItems = (items ?? []) as MenuItem[];
  const uncategorized = typedItems.filter((i) => !i.category_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Menu</h1>
        <p className="text-sm text-muted-foreground">
          Build your menu, then flip ordering on when you&rsquo;re ready.
        </p>
      </div>

      <OrderingToggle enabled={setting?.value === true} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryQuickAdd />
        <MenuItemDialog categories={typedCategories} />
      </div>

      <div className="space-y-4">
        {typedCategories.map((category) => {
          const categoryItems = typedItems.filter(
            (i) => i.category_id === category.id
          );
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <DeleteCategoryButton
                  categoryId={category.id}
                  categoryName={category.name}
                />
              </CardHeader>
              <CardContent>
                {categoryItems.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">
                    No items in this category yet.
                  </p>
                ) : (
                  categoryItems.map((item) => (
                    <MenuItemRow key={item.id} item={item} categories={typedCategories} />
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}

        {(uncategorized.length > 0 || typedCategories.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Uncategorized</CardTitle>
            </CardHeader>
            <CardContent>
              {uncategorized.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Add a category above, then add items to it &mdash; or add
                  items here first and sort them later.
                </p>
              ) : (
                uncategorized.map((item) => (
                  <MenuItemRow key={item.id} item={item} categories={typedCategories} />
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
