"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { getTransactions, saveTransactions } from "@/lib/utils";
import { Transaction } from "@/types/expense";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatLocalDate(dateStr: string) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return new Date(dateStr).toLocaleDateString();
  const [yr, mo, dy] = parts.map(Number);
  const d = new Date(yr, mo - 1, dy);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ViewTransactionPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "income" | "expense">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const currentMonthValue = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);

  useEffect(() => {
    setTransactions(getTransactions());
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

  const filteredTransactions = useMemo(() => {
    if (selectedTab === "all") return monthlyTransactions;
    return monthlyTransactions.filter((transaction) => transaction.type === selectedTab);
  }, [selectedTab, monthlyTransactions]);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />

      <main className="lg:ml-72 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Transactions
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 dark:text-slate-400">
                Browse and manage your saved income and expense entries.
              </p>
            </CardContent>
          </Card>

          {/* Tabs and Month Selector */}
          <Card className="shadow-sm p-5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <Tabs
                value={selectedTab}
                onValueChange={(value) =>
                  setSelectedTab(value as "all" | "income" | "expense")
                }
                className="w-full md:w-auto flex-1"
              >
                <TabsList className="grid w-full md:w-96 grid-cols-3 rounded-full">
                  <TabsTrigger
                    value="all"
                    className="data-active:bg-blue-500 data-active:text-white text-lg cursor-pointer text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    All
                  </TabsTrigger>

                  <TabsTrigger
                    value="income"
                    className="data-active:bg-green-500 cursor-pointer data-active:text-white text-slate-700 dark:text-slate-300 text-lg rounded-full"
                  >
                    Income
                  </TabsTrigger>

                  <TabsTrigger
                    value="expense"
                    className="data-active:bg-red-500 data-active:text-white text-lg cursor-pointer text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    Expense
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="w-full md:w-64 flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider block whitespace-nowrap">Month:</span>
                <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val || currentMonthValue)}>
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

            {/* Transaction List */}
            <div className="mt-6 space-y-4">

              {filteredTransactions.length === 0 ? (
                <div className="rounded-2xl border border-dashed text-lg border-gray-300 p-8 text-center text-gray-600 dark:text-slate-400">
                  No transactions found for <span className="font-medium">{selectedTab}</span>.
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <Card key={transaction.id} className="shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

                      {/* Left side */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">

                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {transaction.description}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              transaction.type === "income"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-slate-400 capitalize">
                          {transaction.category}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {formatLocalDate(transaction.date)}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center justify-between gap-4 md:justify-end">

                        <p className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                          {formatCurrency(transaction.amount)}
                        </p>

                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="rounded-lg p-2 transition-colors cursor-pointer hover:bg-green-50 dark:hover:bg-slate-800"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}