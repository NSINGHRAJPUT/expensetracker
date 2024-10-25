import expenseUser from "@/model/User";
import { NextResponse } from "next/server";
import authenticateToken from "@/middleware/auth";
import jwt from "jsonwebtoken";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await expenseUser.findById(decoded.id);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/expense`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/expense`,
      metadata: { userId: user._id.toString() },
    });

    return new Response(
      JSON.stringify({ success: true, sessionId: session.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create checkout session",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
