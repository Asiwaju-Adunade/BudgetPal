"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  ListPlus,
  PieChart,
  Menu,
  X,
  Wallet,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Transaction", href: "/add-transaction", icon: ListPlus },
  { name: "View Transaction", href: "/view-transaction", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/landing-page");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-[#16A34A] flex items-center h-10 w-10 justify-center rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-semibold">BudgetPal</h1>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-70 md:w-60 bg-white dark:bg-slate-900 border-r dark:border-slate-800
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="bg-[#16A34A] flex items-center h-10 w-10 justify-center rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-2xl font-semibold">BudgetPal</h1>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 rounded-xl px-3 py-3 font-medium transition-all
                    ${
                      isActive
                        ? "bg-[#16A34A] text-white shadow-md"
                        : "text-gray-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-[#16A34A] dark:hover:text-white"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer + Logout */}
          <div className="p-4 space-y-4  dark:border-slate-800">
            <div className="rounded-2xl bg-[#F7F9F0] dark:bg-slate-800 p-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Stay on track
              </p>

              <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
                Review your spending and savings every week.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-1 font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}