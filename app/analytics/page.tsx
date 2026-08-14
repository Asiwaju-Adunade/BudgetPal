"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/types/expense";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { subscribeTransactions } from "@/lib/firestore-service";
import { BarChart3, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-orange-500 text-orange-500 border-orange-500",
  transportation: "bg-blue-500 text-blue-500 border-blue-500",
  data: "bg-cyan-500 text-cyan-500 border-cyan-500",
  bills: "bg-red-500 text-red-500 border-red-500",
  subscription: "bg-purple-500 text-purple-500 border-purple-500",
  groceries: "bg-green-500 text-green-500 border-green-500",
  shopping: "bg-pink-500 text-pink-500 border-pink-500",
  education: "bg-indigo-500 text-indigo-500 border-indigo-500",
  fashion: "bg-fuchsia-500 text-fuchsia-500 border-fuchsia-500",
  beauty: "bg-rose-500 text-rose-500 border-rose-500",
  utilities: "bg-slate-500 text-slate-500 border-slate-500",
  health: "bg-emerald-500 text-emerald-500 border-emerald-500",
  contribution: "bg-indigo-500 text-indigo-500 border-indigo-500",
  rent: "bg-slate-600 text-slate-600 border-slate-600",
  entertainment: "bg-violet-500 text-violet-500 border-violet-500",
  car: "bg-sky-500 text-sky-500 border-sky-500",
  miscellaneous: "bg-gray-500 text-gray-500 border-gray-500",
  salary: "bg-emerald-600 text-emerald-600 border-emerald-600",
  investment: "bg-teal-600 text-teal-600 border-teal-600",
  bonus: "bg-amber-500 text-amber-500 border-amber-500",
  allowance: "bg-purple-600 text-purple-600 border-purple-600",
  other: "bg-stone-500 text-stone-500 border-stone-500",
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const currentUser = user || auth.currentUser;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const currentMonthValue = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);

  // Subscribe to real-time transactions from Firestore for current user
  useEffect(() => {
    const uid = currentUser?.uid;
    if (!uid) {
      setTransactions([]);
      return;
    }

    const unsubscribe = subscribeTransactions(uid, (list) => {
      setTransactions(list);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Compute available month options from date range & existing transactions
  const monthOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const value = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

      options.push({ label, value });
    }

    transactions.forEach((t) => {
      if (t.date) {
        const parts = t.date.split("-");
        if (parts.length >= 2) {
          const value = `${parts[0]}-${parts[1]}`;
          if (!options.some((opt) => opt.value === value)) {
            const yr = Number(parts[0]);
            const mo = Number(parts[1]);
            const d = new Date(yr, mo - 1, 1);
            const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            options.push({ label, value });
          }
        }
      }
    });

    return options.sort((a, b) => b.value.localeCompare(a.value));
  }, [transactions]);

  // Filter transactions by selected month
  const monthlyTransactions = useMemo(
    () => transactions.filter((t) => t.date && t.date.startsWith(selectedMonth)),
    [transactions, selectedMonth]
  );

  // Accurately sum Income for selected month
  const totalIncome = useMemo(
    () =>
      monthlyTransactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [monthlyTransactions]
  );

  // Accurately sum Expenses for selected month
  const totalExpense = useMemo(
    () =>
      monthlyTransactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [monthlyTransactions]
  );

  const balance = totalIncome - totalExpense;

  // Group transactions by category accurately parsing numbers for selected month
  const categoryTotals = useMemo(() => {
    const map: Record<string, { category: string; amount: number; type: string }> = {};

    monthlyTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (!t.category) return;
      if (!map[t.category]) {
        map[t.category] = { category: t.category, amount: 0, type: t.type };
      }
      map[t.category].amount += amt;
    });

    return Object.values(map).sort((a, b) => b.amount - a.amount);
  }, [monthlyTransactions]);

  const maxCategoryAmount = useMemo(() => {
    return categoryTotals.length > 0 ? Math.max(...categoryTotals.map((c) => c.amount)) : 0;
  }, [categoryTotals]);

  const grandTotal = useMemo(() => {
    return categoryTotals.reduce((sum, c) => sum + c.amount, 0);
  }, [categoryTotals]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />

      <main className="lg:ml-72 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header with Month Select */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Analytics & Insights
                  </CardTitle>
                  <p className="text-gray-600 dark:text-slate-400 mt-1">
                    Track your income vs expenses and view detailed category spending breakdown.
                  </p>
                </div>

                {/* Month Selector */}
                <div className="w-full md:w-64 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block whitespace-nowrap">
                    Month:
                  </span>
                  <Select
                    value={selectedMonth}
                    onValueChange={(val) => setSelectedMonth(val || currentMonthValue)}
                  >
                    <SelectTrigger className="w-full py-4 text-base">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Months</SelectLabel>
                        {monthOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary cards */}
          <section className="grid gap-5 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Total Income
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Total Expense
                  </p>
                  <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Current Balance
                  </p>
                  <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600">
                  <Wallet className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bar Chart Section: Category Breakdown */}
          <section>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Category Breakdown
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Visual breakdown of total amounts per category for selected month
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {categoryTotals.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-slate-400 text-center py-6">
                    No transactions found for the selected month. Add some transactions to see your category breakdown.
                  </p>
                ) : (
                  <>
                    {/* Vertical Bar Chart View */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-6 text-center">
                        Category Totals Comparison Bar Chart
                      </p>
                      
                      <div className="flex items-end justify-around gap-2 h-64 pt-6 pb-2 px-2 overflow-x-auto">
                        {categoryTotals.map((item) => {
                          const heightPercentage = maxCategoryAmount > 0 ? Math.max((item.amount / maxCategoryAmount) * 100, 8) : 0;
                          const barColorClass = CATEGORY_COLORS[item.category]?.split(" ")[0] || "bg-green-500";

                          return (
                            <div key={item.category} className="flex flex-col items-center gap-2 flex-1 min-w-[50px] max-w-[80px] h-full justify-end group">
                              <span className="text-xs font-bold text-gray-700 dark:text-slate-300 opacity-90 group-hover:opacity-100">
                                ₦{item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}k` : item.amount}
                              </span>
                              
                              <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                                <div
                                  className={`w-full ${barColorClass} rounded-t-xl transition-all duration-500 hover:brightness-110`}
                                  style={{ height: `${heightPercentage}%` }}
                                />
                              </div>

                              <span className="text-xs font-medium text-gray-600 dark:text-slate-400 capitalize truncate w-full text-center">
                                {item.category.replace(/-/g, " ")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed List with Horizontal Bar Progress */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Detailed Category Summary
                      </h4>

                      {categoryTotals.map((item) => {
                        const percentage = grandTotal > 0 ? Math.round((item.amount / grandTotal) * 100) : 0;
                        const barColorClass = CATEGORY_COLORS[item.category]?.split(" ")[0] || "bg-green-500";

                        return (
                          <div key={item.category} className="space-y-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${barColorClass}`} />
                                <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                                  {item.category.replace(/-/g, " ")}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === "income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"}`}>
                                  {item.type}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {formatCurrency(item.amount)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                                  ({percentage}%)
                                </span>
                              </div>
                            </div>

                            <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full ${barColorClass} transition-all duration-500`}
                                style={{
                                  width: `${Math.max(percentage, 2)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Income vs Expense Bar Chart Comparison */}
          <section>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Income vs Expense Comparison Bar Chart
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 items-center">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                          Total Income ({monthlyTransactions.filter((i) => i.type === "income").length} entries)
                        </p>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0}%
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(totalIncome)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-red-50/50 dark:bg-red-950/20 p-5">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          Total Expense ({monthlyTransactions.filter((i) => i.type === "expense").length} entries)
                        </p>
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                          {totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0}%
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
                        {formatCurrency(totalExpense)}
                      </p>
                    </div>
                  </div>

                  {/* Side-by-Side Visual Bar Chart */}
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 h-64">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                      Income vs Expense Volume
                    </p>

                    <div className="flex items-end justify-center gap-12 h-40 w-full px-6">
                      <div className="flex flex-col items-center gap-2 h-full justify-end w-20">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(totalIncome)}
                        </span>
                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-emerald-500 rounded-t-xl transition-all duration-500"
                            style={{
                              height: `${Math.max(totalIncome, totalExpense) > 0 ? (totalIncome / Math.max(totalIncome, totalExpense)) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Income</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 h-full justify-end w-20">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(totalExpense)}
                        </span>
                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-red-500 rounded-t-xl transition-all duration-500"
                            style={{
                              height: `${Math.max(totalIncome, totalExpense) > 0 ? (totalExpense / Math.max(totalIncome, totalExpense)) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-red-700 dark:text-red-400">Expense</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </div>
  );
}