"use client";

import Button from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <section className="min-h-[calc(100vh-4rem)] bg-[#F7F9F0] flex md:items-center ">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10  pt-15  md:pt-0 ">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="text-lg font-medium text-[#66A240] uppercase tracking-[0.2em]">
                Smart budgeting made simple
              </p>
              <h1 className="text-4xl  md:text-6xl font-semibold leading-tight text-gray-900">
                Take control of your money,{" "}
                <span className="text-[#66A240]">live better.</span>
              </h1>

              <p className="mt-6 text-gray-600 md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                BudgetPal helps you track your income and expenses, understand
                where your money goes, organize your spending habits, and
                achieve your financial goals with confidence.
              </p>

              <div className="mt-8 flex justify-center pb-10 lg:justify-start">
                <Button className="">
                  <Link href="/dashboard">Get Started</Link>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <Image
                src="/svgs/hero-2.jpeg"
                alt="BudgetPal illustration"
                width={1400}
                height={1400}
                priority
                className="w-full max-w-[5\40px]  md:max-w-[700px] h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
