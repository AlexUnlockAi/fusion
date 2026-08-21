"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  const [sharing, setSharing] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      setSharing(true);
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled — ignore
      } finally {
        setSharing(false);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — ready to paste and post!");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={sharing}
      onClick={handleShare}
      className={className}
    >
      <Share2 className="size-4" />
      Share
    </Button>
  );
}
