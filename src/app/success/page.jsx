"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      try {
        const response = await axios.get(
          `https://expensetracker-lake-alpha.vercel.app/api/stripe/verify?session_id=${sessionId}`
        );
        if (response.data.success) {
          toast.success("Payment successful");
          // change the isPremium in the cookies to true and if not found then create it
          document.cookie = "isPremium=true; path=/";
          router.push("/expense");
        } else {
          toast.error("Payment verification failed");
          router.push("/");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Something went wrong with payment verification");
        router.push("/");
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying payment...</p>
    </div>
  );
}
