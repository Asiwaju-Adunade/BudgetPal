"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { createUserProfile } from "@/lib/firestore-service";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const newUserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const trimmedName = name.trim();
        await updateProfile(newUserCredential.user, {
          displayName: trimmedName,
        });

        // Save user profile document in Firestore
        await createUserProfile(newUserCredential.user.uid, trimmedName, email);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`user_name_${newUserCredential.user.uid}`, trimmedName);
          } catch {}
        }

        router.push("/dashboard");
      } catch (e: unknown) {
        const error = e as { code?: string; message?: string };

        if (error.code === "auth/email-already-in-use") {
          setErrors({
            email: "Email already in use. Please log in.",
          });
        } else {
          setErrors({
            general: error.message ?? "An unknown error occurred",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9F0] px-4 sm:px-6 md:px-8 py-6">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16A34A] text-white">
          <Wallet className="h-6 w-6" />
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          BudgetPal
        </h1>
      </div>

      {/* Content */}
      <div className="my-12 md:my-5 flex justify-center">
        <div className="w-full max-w-xl">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-center text-gray-900">
            Create an account 
          </h1>

          <p className="text-center text-base sm:text-lg text-gray-500 mt-3">
            Please sign up to get started.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            {/* Name */}
            <div>
              <Input
                type="text"
                value={name}
                placeholder="Enter your name"
                label="User Name"
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    name: undefined,
                  }));
                }}
                className="text-base h-14 rounded-full px-5 border-2 border-gray-400 text-black"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                value={email}
                placeholder="Enter your email"
                label="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
                className="text-base h-14 rounded-full px-5 border-2 border-gray-300 text-black"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                label="Password"
                placeholder="********"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                    general: undefined,
                  }));
                }}
                className="pr-12 text-base h-14 rounded-full px-5 border-2 border-gray-300 text-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-11 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff size={22} />
                ) : (
                  <Eye size={22} />
                )}
              </button>

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                label="Confirm Password"
                placeholder="********"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                className="pr-12 text-base h-14 rounded-full px-5 border-2 border-gray-300 text-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-5 top-11 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff size={22} />
                ) : (
                  <Eye size={22} />
                )}
              </button>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-14 rounded-full text-base font-medium"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}