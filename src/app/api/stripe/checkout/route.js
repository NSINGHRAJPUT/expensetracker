import expenseUser from "@/model/User";
import { NextResponse } from "next/server";
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
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://expensetracker-lake-alpha.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://expensetracker-lake-alpha.vercel.app/expense?canceled=true`,
      metadata: { userId: user._id.toString() },
    });

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        message: "Checkout session created successfully",
      }),
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
