import { redirect } from "next/navigation";

// Pricing/subscription system removed. All features are free.
export default function PricingPage() {
  redirect("/dashboard");
}
