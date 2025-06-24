"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Button } from "@nextui-org/react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state with an empty email field
  const [data, setData] = useState({
    email: "",
  });

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Reset Link has been sent to your email!");
    } catch (error) {
      toast.error(error?.message || "Error sending reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center bg-gray-300 md:p-24 p-10 min-h-screen">
      <section className="flex flex-col gap-3">
        {/* Logo Section */}
        <div className="flex justify-center">
          <img className="h-12" src="/logo.png" alt="Logo" />
        </div>
        {/* Form Section */}
        <div className="flex flex-col gap-3 bg-white md:p-10 p-5 rounded-xl md:min-w-[440px] w-full">
          <h1 className="font-bold text-xl">Forgot Password</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col gap-3"
          >
            {/* Email Input */}
            <input
              placeholder="Enter Your Email"
              type="email"
              name="user-email"
              id="user-email"
              value={data.email}
              onChange={(e) => {
                handleData("email", e.target.value);
              }}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />

            {/* Submit Button */}
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              color="primary"
            >
              Send Reset Link
            </Button>
          </form>
          {/* Link to Login */}
          <div className="flex justify-between">
            <Link href="/login">
              <button className="font-semibold text-sm text-blue-700">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
