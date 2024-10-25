const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { NextResponse } = require("next/server");
const authenticateToken = require("../../../middleware/auth");

export const POST = async (req) => {
  try {
    // Authenticate user
    const user = await authenticateToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Subscription",
            },
            unit_amount: 999, // Amount in cents ($9.99)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-cancel`,
      metadata: { userId: user._id.toString() },
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session" },
      { status: 500 }
    );
  }
};
