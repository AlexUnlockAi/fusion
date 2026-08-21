"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { formatCents } from "@/lib/money";
import { getUpcomingWeekendDates } from "@/lib/dates";
import { placeOrder } from "@/app/(site)/order/actions";

type PickupInfo = {
  venue: string;
  address: string;
  city: string;
  schedule: string;
  saturdayHours: string;
  sundayHours: string;
};
type DeliveryInfo = { area: string; fee_cents: number; minimum_cents: number };

export function CartDrawer({
  pickup,
  delivery,
}: {
  pickup: PickupInfo;
  delivery: DeliveryInfo;
}) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    orderNumber: string;
    totalCents: number;
  } | null>(null);

  const weekendDates = getUpcomingWeekendDates();
  const deliveryFee = fulfillment === "delivery" ? delivery.fee_cents : 0;
  const total = cart.subtotalCents + deliveryFee;

  async function handleSubmit() {
    setError(null);
    if (fulfillment === "pickup" && !pickupDate) {
      setError("Choose a pickup date.");
      return;
    }
    setSubmitting(true);
    const result = await placeOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      fulfillmentType: fulfillment,
      pickupDate: fulfillment === "pickup" ? pickupDate : null,
      deliveryAddress: fulfillment === "delivery" ? address : null,
      deliveryCity: fulfillment === "delivery" ? city : null,
      deliveryZip: fulfillment === "delivery" ? zip : null,
      notes,
      items: cart.items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setConfirmation({ orderNumber: result.orderNumber, totalCents: result.totalCents });
    setStep("done");
    cart.clear();
  }

  function handleClose(next: boolean) {
    setOpen(next);
    if (!next && step === "done") {
      setStep("cart");
      setConfirmation(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open cart"
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-adinkra-gold px-5 py-3.5 font-medium text-adinkra-ink shadow-lg shadow-black/30 transition-transform hover:scale-105"
          />
        }
      >
        <ShoppingBag className="size-4" />
        {cart.count > 0 ? `${cart.count} · ${formatCents(cart.subtotalCents)}` : "Cart"}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full border-none bg-adinkra-ink p-0 text-adinkra-cream sm:max-w-md"
      >
        <SheetTitle className="sr-only">Your order</SheetTitle>
        <SheetDescription className="sr-only">
          Review your cart and check out
        </SheetDescription>

        <div className="flex h-full flex-col px-6 py-8">
          {step === "done" && confirmation ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-12 text-adinkra-green" />
              <h2 className="mt-5 font-heading text-2xl font-medium">
                Order placed!
              </h2>
              <p className="mt-2 text-adinkra-cream-muted">
                Confirmation <strong className="text-adinkra-cream">{confirmation.orderNumber}</strong>
              </p>
              <p className="mt-1 text-adinkra-cream-muted">
                Total: {formatCents(confirmation.totalCents)}
              </p>
              <p className="mt-4 max-w-xs text-sm text-adinkra-cream-muted">
                We&rsquo;ll reach out to confirm details. Payment is collected
                on pickup or delivery for now.
              </p>
              <Button
                className="mt-8 rounded-full bg-adinkra-gold text-adinkra-ink hover:bg-adinkra-gold/90"
                onClick={() => handleClose(false)}
              >
                Done
              </Button>
            </div>
          ) : step === "cart" ? (
            <>
              <h2 className="font-heading text-2xl font-medium">Your Order</h2>
              <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
                {cart.items.length === 0 ? (
                  <p className="text-adinkra-cream-muted">Your cart is empty.</p>
                ) : (
                  cart.items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-adinkra-ink">
                          <Image src={item.imageUrl} alt="" fill className="object-contain" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-sm text-adinkra-cream-muted">
                          {formatCents(item.priceCents)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex size-6 items-center justify-center rounded-full bg-adinkra-cream/10 hover:bg-adinkra-cream/20"
                          onClick={() =>
                            cart.updateQuantity(item.menuItemId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="flex size-6 items-center justify-center rounded-full bg-adinkra-cream/10 hover:bg-adinkra-cream/20"
                          onClick={() =>
                            cart.updateQuantity(item.menuItemId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => cart.remove(item.menuItemId)}
                        className="text-adinkra-cream-muted hover:text-adinkra-red"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cart.items.length > 0 && (
                <div className="mt-6 space-y-4 border-t border-adinkra-cream/10 pt-6">
                  <div className="flex justify-between font-heading text-lg">
                    <span>Subtotal</span>
                    <span>{formatCents(cart.subtotalCents)}</span>
                  </div>
                  <Button
                    className="w-full rounded-full bg-adinkra-gold text-adinkra-ink hover:bg-adinkra-gold/90"
                    onClick={() => setStep("checkout")}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="w-fit text-sm text-adinkra-cream-muted hover:text-adinkra-cream"
              >
                &larr; Back to cart
              </button>
              <h2 className="mt-2 font-heading text-2xl font-medium">Checkout</h2>

              <div className="mt-6 flex-1 space-y-5 overflow-y-auto">
                <div className="flex gap-2 rounded-full bg-adinkra-cream/10 p-1">
                  {(["pickup", "delivery"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFulfillment(type)}
                      className={`flex-1 rounded-full py-2 text-sm font-medium capitalize transition-colors ${
                        fulfillment === type
                          ? "bg-adinkra-gold text-adinkra-ink"
                          : "text-adinkra-cream-muted"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {fulfillment === "pickup" ? (
                  <div className="space-y-2">
                    <p className="text-sm text-adinkra-cream-muted">
                      {pickup.venue}, {pickup.address}
                      <br />
                      Sat {pickup.saturdayHours} &middot; Sun {pickup.sundayHours}
                    </p>
                    <Label className="text-adinkra-cream">Pickup date</Label>
                    <select
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-lg border border-adinkra-cream/20 bg-transparent px-3 py-2 text-sm text-adinkra-cream"
                    >
                      <option value="" className="text-adinkra-ink">
                        Select a date
                      </option>
                      {weekendDates.map((d) => (
                        <option key={d.value} value={d.value} className="text-adinkra-ink">
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-adinkra-cream-muted">
                      Delivering across {delivery.area} &middot; +
                      {formatCents(delivery.fee_cents)} delivery fee
                    </p>
                    <div className="space-y-2">
                      <Label className="text-adinkra-cream">Address</Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-adinkra-cream">City</Label>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-adinkra-cream">Zip</Label>
                        <Input value={zip} onChange={(e) => setZip(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-adinkra-cream/10 pt-5">
                  <div className="space-y-2">
                    <Label className="text-adinkra-cream">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-adinkra-cream">Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-adinkra-cream">Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-adinkra-cream">Notes (optional)</Label>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="border-adinkra-cream/20 bg-transparent text-adinkra-cream" rows={2} />
                  </div>
                </div>

                {error && <p className="text-sm text-adinkra-red">{error}</p>}
              </div>

              <div className="mt-6 space-y-3 border-t border-adinkra-cream/10 pt-6">
                <div className="space-y-1 text-sm text-adinkra-cream-muted">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCents(cart.subtotalCents)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery fee</span>
                      <span>{formatCents(deliveryFee)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between font-heading text-lg text-adinkra-cream">
                  <span>Total</span>
                  <span>{formatCents(total)}</span>
                </div>
                <Button
                  disabled={submitting || !name.trim()}
                  className="w-full rounded-full bg-adinkra-gold text-adinkra-ink hover:bg-adinkra-gold/90"
                  onClick={handleSubmit}
                >
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Place Order &mdash; Pay on {fulfillment === "pickup" ? "Pickup" : "Delivery"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
