"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data state with empty strings for controlled inputs
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Function to handle changes in form inputs
  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Handle the signup process
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(credential.user, {
        displayName: data.name,
      });
      const newUser = credential.user;
      await createUser({
        uid: newUser.uid,
        displayName: data.name,
        photoURL: newUser.photoURL,
        email: user?.email, // Pass the email
      });
      toast.success("Successfully signed up!");
      router.push("/account"); // Redirect to the account page after success
    } catch (error) {
      toast.error(error.message || "Error signing up. Please try again.");
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
          <h1 className="font-bold text-xl">Sign Up With Email</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col gap-3"
          >
            {/* Name Input */}
            <input
              placeholder="Enter Your Name"
              type="text"
              name="name"
              id="user-name"
              value={data.name}
              onChange={(e) => handleData("name", e.target.value)}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />
            {/* Email Input */}
            <input
              placeholder="Enter Your Email"
              type="email"
              name="email"
              id="user-email"
              value={data.email}
              onChange={(e) => handleData("email", e.target.value)}
              className="px-3 py-2 rounded-xl border focus:outline-none w-full"
              required
            />
            {/* Password Input */}
            <input
              placeholder="Enter Your Password"
              type="password"
              name="password"
              id="user-password"
              value={data.password}
              onChange={(e) => handleData("password", e.target.value)}
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
              Sign Up
            </Button>
          </form>
          {/* Link to Login */}
          <div className="flex justify-between">
            <Link href="/login">
              <button className="font-semibold text-sm text-blue-700">
                Already a user? Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
