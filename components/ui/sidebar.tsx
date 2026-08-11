"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  ListPlus,
  PieChart,
  Menu,
  X,
  Wallet
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Transaction", href: "/add-transaction", icon: ListPlus },
  { name: "View Transaction", href: "/view-transaction", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2">
            <div className="bg-[#16A34A] flex items-center h-10 w-10 justify-center rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
            </div>
          <h1 className="text-2xl md:text-3xl font-semibold">BudgetPal</h1>
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
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
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
        {/* Header and logo*/}
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
           <div className="flex items-center gap-2">
            <div className="bg-[#16A34A] flex items-center h-10 w-10 justify-center rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
            </div>
          <h1 className="text-2xl md:text-3xl font-semibold">BudgetPal</h1>
        </div>
        

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-4 sticky top-0 z-50">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-4 rounded-xl px-2 py-3 font-medium transition-all
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

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-2xl bg-[#F7F9F0] dark:bg-slate-800 p-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              Stay on track
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
              Review your spending and savings every week.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}






