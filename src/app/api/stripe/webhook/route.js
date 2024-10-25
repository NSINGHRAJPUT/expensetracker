import { NextResponse } from "next/server";
import stripeLib from "stripe";
import expenseUser from "@/model/User";
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the webhook signature and parse the event
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { success: false, message: "Webhook Error" },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Update user premium status in database
      const userId = session.metadata.userId;
      await expenseUser.findByIdAndUpdate(userId, { isPremium: true });

      return NextResponse.json({
        success: true,
        message: "User upgraded to premium",
      });
    } catch (error) {
      console.error("Error updating user to premium:", error);
      return NextResponse.json(
        { success: false, message: "User update error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, message: "Event received" });
};
