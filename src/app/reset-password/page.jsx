"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../_Components/Layout/Header";
import Footer from "../_Components/Layout/Footer";
import Loader from "../_Components/Loader";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://expensetracker-lake-alpha.vercel.app/api/auth/send-otp",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("OTP sent to your email");
        router.push(`/verify-otp?token=${response.data.token}`);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
      console.log("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-y-hidden h-screen">
      {loading && <Loader />}
      <Header />
      <div className="min-h-[70vh] max-w-7xl mx-auto p-8 bg-gray-200 flex items-center justify-center">
        <div className="w-[] md:w-1/2 bg-white flex flex-col items-center justify-center p-8">
          <form
            className="w-full max-w-md"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
