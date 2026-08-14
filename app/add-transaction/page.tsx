"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import Sidebar from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  Utensils,
  Bus,
  Wifi,
  Receipt,
  Repeat,
  ShoppingBasket,
  ShoppingBag,
  GraduationCap,
  Shirt,
  Sparkles,
  Zap,
  HeartPulse,
  Home,
  Clapperboard,
  Car,
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Gift,
  HandCoins,
} from "lucide-react";
import { Category } from "@/types/expense";
import { addTransactionToFirestore } from "@/lib/firestore-service";
import { auth } from "@/lib/firebase";

// EXPENSE TAB
const expenseItems = [
  { label: "Food", value: "food" as Category, icon: Utensils, text: "text-orange-600", bg: "bg-orange-100" },
  { label: "Transportation", value: "transportation" as Category, icon: Bus, text: "text-blue-600", bg: "bg-blue-100" },
  { label: "Data", value: "data" as Category, icon: Wifi, text: "text-cyan-600", bg: "bg-cyan-100" },
  { label: "Bills", value: "bills" as Category, icon: Receipt, text: "text-red-600", bg: "bg-red-100" },
  { label: "Subscription", value: "subscription" as Category, icon: Repeat, text: "text-purple-600", bg: "bg-purple-100" },
  { label: "Groceries", value: "groceries" as Category, icon: ShoppingBasket, text: "text-green-600", bg: "bg-green-100" },
  { label: "Shopping", value: "shopping" as Category, icon: ShoppingBag, text: "text-pink-600", bg: "bg-pink-100" },
  { label: "Education", value: "education" as Category, icon: GraduationCap, text: "text-indigo-600", bg: "bg-indigo-100" },
  { label: "Fashion", value: "fashion" as Category, icon: Shirt, text: "text-fuchsia-600", bg: "bg-fuchsia-100" },
  { label: "Beauty", value: "beauty" as Category, icon: Sparkles, text: "text-rose-600", bg: "bg-rose-100" },
  { label: "Utilities", value: "utilities" as Category, icon: Zap, text: "text-slate-600", bg: "bg-slate-100" },
  { label: "Health", value: "health" as Category, icon: HeartPulse, text: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Contribution", value: "contribution" as Category, icon: HandCoins, text: "text-indigo-600", bg: "bg-indigo-100" },
  { label: "Rent", value: "rent" as Category, icon: Home, text: "text-slate-700", bg: "bg-slate-100" },
  { label: "Entertainment", value: "entertainment" as Category, icon: Clapperboard, text: "text-violet-600", bg: "bg-violet-100" },
  { label: "Car", value: "car" as Category, icon: Car, text: "text-sky-600", bg: "bg-sky-100" },
  { label: "Miscellaneous", value: "miscellaneous" as Category, icon: MoreHorizontal, text: "text-gray-600", bg: "bg-gray-100" },
];

// INCOME TAB
const incomeItems = [
  { label: "Salary", value: "salary" as Category, icon: Wallet, text: "text-green-700", bg: "bg-green-100" },
  { label: "Investment", value: "investment" as Category, icon: TrendingUp, text: "text-teal-700", bg: "bg-teal-100" },
  { label: "Bonus", value: "bonus" as Category, icon: Gift, text: "text-amber-700", bg: "bg-amber-100" },
  { label: "Allowance", value: "allowance" as Category, icon: HandCoins, text: "text-purple-600", bg: "bg-purple-100" },
  { label: "Other", value: "other" as Category, icon: CircleDollarSign, text: "text-stone-600", bg: "bg-stone-100" },
];

export default function AddTransactionPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"income" | "expense">("income");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categoryItems = useMemo(
    () => (selectedTab === "income" ? incomeItems : expenseItems),
    [selectedTab]
  );

  useEffect(() => {
    setCategory("");
  }, [selectedTab]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate(new Date());
    setCategory("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const currentUser = user || auth.currentUser;

    if (!currentUser?.uid) {
      setError("Please log in to your account to add a transaction.");
      return;
    }

    const amountNumber = Number(amount);
    if (!description.trim() || !amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError("Please provide a valid description and amount.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    setIsSaving(true);
    try {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      await addTransactionToFirestore(currentUser.uid, {
        type: selectedTab,
        amount: amountNumber,
        category,
        description: description.trim(),
        date: dateStr,
      });

      resetForm();
      setSuccess("Transaction saved successfully.");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Failed to save transaction. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />

      <main className="lg:ml-72 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-8 py-10 shadow-sm">
            <CardHeader className="space-y-2 text-center md:text-left">
              <CardTitle className="text-xl font-bold">Add Transaction</CardTitle>
              <p className="text-gray-600 dark:text-slate-400">
                Fill in the details below to record your income or expense.
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-500">
                Keeping your transactions updated helps you track your spending and manage your budget better.
              </p>
            </CardHeader>

            <div className="mt-4">
              <Tabs
                value={selectedTab}
                onValueChange={(value) => setSelectedTab(value as "income" | "expense")}
                className="w-full"
              >
                <TabsList className="flex w-full md:w-1/2 gap-2 rounded-full">
                  <TabsTrigger
                    className="data-active:bg-green-500 data-active:text-white p-3 cursor-pointer text-slate-700 dark:text-slate-200 text-lg rounded-full"
                    value="income"
                  >
                    Income
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-active:bg-red-500 data-active:text-white p-3 cursor-pointer text-slate-700 dark:text-slate-200 text-lg rounded-full"
                    value="expense"
                  >
                    Expense
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700 dark:text-slate-300">Description</label>
                  <Input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-gray-700 dark:text-slate-300">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700 dark:text-slate-300">Category</label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categoryItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-3 cursor-pointer rounded-xl p-1">
                              <div className={`flex h-9 w-9 items-center justify-center p-2 rounded-lg ${item.bg}`}>
                                <item.icon className={`size-5 ${item.text}`} />
                              </div>
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-gray-700 dark:text-slate-300">Date</label>
                  <Input
                    type="date"
                    value={
                      date
                        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const [yr, mo, dy] = value.split("-").map(Number);
                        setDate(new Date(yr, mo - 1, dy));
                      } else {
                        setDate(undefined);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
              {success ? <p className="text-sm text-green-600 font-medium">{success}</p> : null}

              <div className="flex py-4 justify-center">
                <Button type="submit" className="w-80" variant="primary" isLoading={isSaving}>
                  Save Transaction
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}