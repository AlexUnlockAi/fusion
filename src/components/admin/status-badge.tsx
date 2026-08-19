import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-800",
  ready: "bg-violet-100 text-violet-700",
  out_for_delivery: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("border-transparent", STYLES[status])}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
