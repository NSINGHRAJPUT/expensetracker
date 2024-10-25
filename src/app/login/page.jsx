"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../_Components/Layout/Header";
import Footer from "../_Components/Layout/Footer";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

export default function SignInPage() {
  const cookies = new Cookies();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const test = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/test`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    test();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Login successful");
        cookies.set("token", response.data.token, {
          path: "/",
        });
        router.push("/expense");
      }
    } catch (error) {
      toast.error("Login failed");
      console.log("Error registering user:", error);
    }
  };

  return (
    <div className="overflow-y-hidden h-screen">
      <Header />
      <div className="min-h-[70vh] max-w-7xl mx-auto p-8 bg-gray-200 flex items-center justify-center">
        <div className="w-[] md:w-1/2 bg-white flex flex-col items-center justify-center p-8">
          <form
            className="w-full max-w-md"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

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
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Login In
            </button>
          </form>

          <p
            className="mt-4 text-gray-500 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            not yet registered ? Register here
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
