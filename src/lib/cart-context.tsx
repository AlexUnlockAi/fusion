"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  menuItemId: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl: string | null;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  remove: (menuItemId: string) => void;
  clear: () => void;
  subtotalCents: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (item) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.menuItemId === item.menuItemId);
        if (existing) {
          return prev.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    };

    const updateQuantity: CartContextValue["updateQuantity"] = (
      menuItemId,
      quantity
    ) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.menuItemId !== menuItemId)
          : prev.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            )
      );
    };

    const remove: CartContextValue["remove"] = (menuItemId) => {
      setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    };

    const clear = () => setItems([]);

    const subtotalCents = items.reduce(
      (sum, i) => sum + i.priceCents * i.quantity,
      0
    );
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return { items, add, updateQuantity, remove, clear, subtotalCents, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
