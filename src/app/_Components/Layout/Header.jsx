"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Track premium status
  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong with checkout");
    }
  };

  const handleLogout = () => {
    cookies.remove("token");
    setIsLoggedIn(false);
    setIsPremium(false); // Reset premium status on logout
    router.push("/");
  };

  return (
    <header className="bg-black z-50 text-white py-4 px-[2.5%] relative">
      <Toaster />
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/">
            <span>Expense Tracker</span>
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="text-white"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full lg:static lg:block lg:w-auto bg-black lg:bg-transparent z-20 lg:flex lg:items-center`}
        >
          <div className="lg:hidden flex flex-col items-center py-4">
            {isPremium ? (
              <button className="block py-2 px-4 text-white hover:text-gray-300">
                Toggle Theme
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className="block py-2 px-4 text-white hover:text-gray-300"
              >
                Buy Premium
              </button>
            )}
            {isLoggedIn ? (
              <span
                className="block py-2 px-4 text-white hover:text-gray-300 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </span>
            ) : (
              <>
                <Link href="/login">
                  <span
                    className="block py-2 px-4 text-white hover:text-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </span>
                </Link>
                <Link href="/signup">
                  <span
                    className="block py-2 px-4 bg-white text-black rounded-md hover:bg-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
