import expenseUser from "@/model/User";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { NextResponse } = require("next/server");
const authenticateToken = require("@/middleware/auth");
const jwt = require("jsonwebtoken");

export const POST = async (req) => {
  try {
    console.log("req", req);
    const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await expenseUser.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log(user);
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
            unit_amount: 1, // Amount in cents ($9.99)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/expense`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/expense`,
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
