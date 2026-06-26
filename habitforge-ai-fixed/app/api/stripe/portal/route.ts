import { NextResponse } from "next/server";
// Stripe/subscription system removed.
export async function POST() {
  return NextResponse.json({ error: "Subscription system is disabled." }, { status: 410 });
}
export async function GET() {
  return NextResponse.json({ error: "Subscription system is disabled." }, { status: 410 });
}
