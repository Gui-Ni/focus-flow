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

    // Create LemonSqueezy checkout URL
    const checkoutUrl = `https://lemonsqueezy.com/checkout/buy/${variantId}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
