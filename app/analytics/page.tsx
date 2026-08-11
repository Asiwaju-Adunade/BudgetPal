"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTransactions } from "@/lib/utils";
import { Transaction } from "@/types/expense";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  const currentMonthValue = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);

  useEffect(() => {
    setTransactions(getTransactions());
    setMounted(true);
  }, []);

  const monthOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [];
    const now = new Date();
    
    // Add current month and past 11 months
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      options.push({ label, value });
    }
    
    // Include months from transactions
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

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(
    () => monthlyTransactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0),
    [monthlyTransactions]
  );
  const totalExpense = useMemo(
    () => monthlyTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0),
    [monthlyTransactions]
  );
  const balance = totalIncome - totalExpense;

  const totalsByCategory = useMemo(() => {
    return monthlyTransactions.reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
  }, [monthlyTransactions]);

  const sortedCategories = useMemo(
    () =>
      Object.entries(totalsByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6),
    [totalsByCategory]
  );

  const maxCategoryAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;

  const chartData = useMemo(() => {
    return Object.entries(totalsByCategory).map(([category, amount]) => ({
      name: category.replace(/-/g, " "),
      amount,
    }));
  }, [totalsByCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-72 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header & Month Selector */}
          <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
            <Card className="shadow-sm flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track your income vs expenses and see which categories move your balance.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm p-4 flex flex-col justify-center gap-2 md:w-80">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Selected Month</span>
              <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val || currentMonthValue)}>
                <SelectTrigger className="w-full py-6 pr-8 text-base">
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
            </Card>
          </div>

          <section className="grid gap-5 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">Total Expense</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalExpense)}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
              </CardContent>
            </Card>
          </section>
 
          <section>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartData.length === 0 ? (
                  <p className="text-sm text-gray-600">Add some transactions to see analytics.</p>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-center">
                    <div className="w-full h-80 flex items-center justify-center bg-white rounded-2xl p-4 border border-gray-100">
                      {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}`} />
                            <Tooltip formatter={(v: any) => [formatCurrency(Number(v)), "Amount"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
                            <Bar dataKey="amount" fill="#16A34A" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-gray-400">Loading chart...</p>
                      )}
                    </div>
                    
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {sortedCategories.map(([category, amount]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-700">
                            <span className="capitalize">{category.replace(/-/g, " ")}</span>
                            <span className="font-semibold">{formatCurrency(amount)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${Math.round((amount / Math.max(maxCategoryAmount, 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
 
          <section>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Transaction composition</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6">
                    <p className="text-sm text-gray-500">Income transactions</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{monthlyTransactions.filter((item) => item.type === "income").length}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6">
                    <p className="text-sm text-gray-500">Expense transactions</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{monthlyTransactions.filter((item) => item.type === "expense").length}</p>
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
