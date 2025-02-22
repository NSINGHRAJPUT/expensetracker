"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../_Components/Layout/Header";
import Footer from "../_Components/Layout/Footer";
import Loader from "../_Components/Loader";
import toast from "react-hot-toast";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/reset-password",
        { token, otp, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Password reset successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Failed to reset password");
      console.log("Error resetting password:", error);
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
              Verify OTP & Reset Password
            </h2>

            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
