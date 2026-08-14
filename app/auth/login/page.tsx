"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9F0] px-4 sm:px-6 md:px-8 py-6">

      {/* Logo - edge/top left */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16A34A] text-white">
          <Wallet className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          BudgetPal
        </h1>
      </div>

      {/* Content */}
      <div className="mt-12 md:mt-10 flex justify-center">
        <div className="w-full max-w-xl">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-semibold text-center text-gray-900">
            Welcome back
          </h2>

          <p className="text-center text-base sm:text-lg text-gray-500 mt-3">
            Log in to your BudgetPal account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {/* Email */}
            <Input
              label="Email address"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-full border-2 border-gray-300 text-black px-5 text-base"
            />

            {/* Password */}
            <div className="relative pb-3">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-full px-5 pr-12 text-base border-2 border-gray-300 text-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-11 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-14 text-base font-medium"
            >
              Log In
            </Button>
           
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm sm:text-base text-gray-600">
            Dont have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-green-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}