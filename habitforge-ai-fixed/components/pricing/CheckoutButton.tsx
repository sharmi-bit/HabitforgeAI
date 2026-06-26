"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_id: priceId }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.error ?? "Checkout failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full gradient-primary text-white border-0">
      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Upgrade to Premium"}
    </Button>
  );
}
