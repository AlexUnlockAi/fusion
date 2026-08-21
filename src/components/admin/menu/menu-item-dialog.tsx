"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertMenuItem } from "@/app/admin/(dashboard)/menu/actions";
import { createClient } from "@/lib/supabase/client";
import type { MenuCategory, MenuItem } from "@/lib/types";

export function MenuItemDialog({
  categories,
  item,
}: {
  categories: MenuCategory[];
  item?: MenuItem;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(
    item ? (item.price_cents / 100).toFixed(2) : ""
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    item?.category_id ?? null
  );
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("menu-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    const priceCents = Math.round(parseFloat(price || "0") * 100);
    if (!name.trim() || !priceCents) {
      toast.error("Name and price are required.");
      return;
    }

    startTransition(async () => {
      try {
        await upsertMenuItem({
          id: item?.id,
          category_id: categoryId ?? null,
          name: name.trim(),
          description: description.trim(),
          price_cents: priceCents,
          image_url: imageUrl || null,
        });
        toast.success(item ? "Item updated" : "Item added");
        setOpen(false);
      } catch {
        toast.error("Couldn't save the item.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          item ? (
            <Button variant="ghost" size="icon-sm" aria-label="Edit item" />
          ) : (
            <Button size="sm" />
          )
        }
      >
        {item ? <Pencil className="size-3.5" /> : <><Plus className="size-4" /> Add Item</>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea
              id="item-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-price">Price (USD)</Label>
              <Input
                id="item-price"
                inputMode="decimal"
                placeholder="12.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border">
                  <Image src={imageUrl} alt="" fill className="object-contain" />
                </div>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                {imageUrl ? "Replace Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" disabled={pending || uploading} onClick={handleSubmit}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {item ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
