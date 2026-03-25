import { NextResponse } from "next/server";

export async function POST() {
  try {
    const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 500 }
      );
    }

    // Create LemonSqueezy checkout URL with the full UUID-based link
    const checkoutUrl = `https://focus-flow.lemonsqueezy.com/checkout/buy/e988b18e-767a-4135-8e09-128d6fa40cf4`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
