import expenseUser from "@/model/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const userId = session.metadata.userId;
      const user = await expenseUser.findById(userId);
      if (user) {
        user.isPremium = true;
        await user.save();
        return new Response(
          JSON.stringify({
            success: true,
            message: "Payment verified and user updated",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Payment not verified" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error verifying Stripe session:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
