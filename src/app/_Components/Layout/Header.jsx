"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "universal-cookie";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Header({ onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookies = new Cookies();
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
    if (cookies.get("isPremium")) {
      setIsPremium(true);
    }
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    console.log(stripe);
    try {
      const response = await axios.post(
        "https://expensetracker-pi-one.vercel.app/api/stripe/checkout", // Ensure this is an absolute URL
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      if (data.success) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (!error) {
          router.push("/expense"); // Redirect to /expense after successful payment
        } else {
          toast.error("Failed to initiate checkout");
        }
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
    cookies.remove("isPremium");
    setIsLoggedIn(false);
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
          <div className="lg:flex lg:items-center lg:space-x-4 py-4 lg:py-0">
            {isLoggedIn && !isPremium && (
              <button
                onClick={handleCheckout}
                className="block py-2 px-4 text-white hover:text-gray-300"
              >
                Buy Premium
              </button>
            )}
            {isPremium && (
              <button
                className="block py-2 px-4 text-white hover:text-gray-300"
                onClick={onToggleTheme}
              >
                Toggle Theme
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
