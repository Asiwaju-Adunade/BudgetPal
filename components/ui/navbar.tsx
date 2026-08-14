"use client";
import { useState } from "react";
import Link from "next/link";
import { Wallet, Menu } from "lucide-react";
import Button from "./button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/landing-page" },
  { name: "Features", href: "/landing-page/features" },
  { name: "Benefits", href: "/landing-page/benefits" },
  { name: "How it works?", href: "/landing-page/how-it-works" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <nav className="border-b bg-white sticky top-0 z-50">
          <div className="flex py-4 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 ml-3 md:ml-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#16A34A] text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-black font-semibold">BudgetPal</h1>
            </div>

            {/* Desktop Menu */}
            <div className="flex mx-auto">
              <div className="hidden md:flex items-center gap-10">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`rounded-lg px-4 py-2 text-lg font-medium transition-all ${
                        isActive
                          ? "bg-[#16A34A] text-white shadow-sm"
                          : "text-black hover:text-[#16A34A] hover:bg-green-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center mr-15 gap-7">
              <Button variant="secondary" onClick={() => router.push('/auth/login')}>Log In</Button>
              <Button variant="primary" onClick={() => router.push('/auth/signup')}>Get Started</Button>
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="md:hidden rounded-lg p-2 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-7 w-7 text-black" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-6">
              <div className="flex flex-col mx-4 gap-5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`rounded-lg px-3 py-2 text-lg font-medium transition-all ${
                        isActive
                          ? "bg-[#16A34A] text-white shadow-sm"
                          : "text-gray-700 hover:text-[#16A34A] hover:bg-green-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col mx-4 gap-5">
                <Button variant="secondary" onClick={() => { setIsMobileMenuOpen(false); router.push('/auth/login'); }}>Log In</Button>
                <Button variant="primary" onClick={() => { setIsMobileMenuOpen(false); router.push('/auth/signup'); }}>Get Started</Button>
              </div>
            </div>
          )}
      </nav>
    </>
  );
}
