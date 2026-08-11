"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpFromLine, ArrowDownFromLine, Wallet } from "lucide-react";
import { getTransactions } from "@/lib/utils";
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
import Summary, { SummaryItem } from "./summary-card";
import BarChart from "./bar-chart";
import BudgetSection from "./budget";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0.0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [budgetSuccess, setBudgetSuccess] = useState("");

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setTransactions(getTransactions());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const savedBudget = localStorage.getItem(`budget_${selectedMonth}`);
    setMonthlyBudget(savedBudget ? Number(savedBudget) : 0.00);
  }, [selectedMonth]);

  useEffect(() => {
    if (!budgetSuccess) return;

    const timer = window.setTimeout(() => {
      setBudgetSuccess("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [budgetSuccess]);

  const handleSaveBudget = () => {
    localStorage.setItem(`budget_${selectedMonth}`, String(monthlyBudget));
    setBudgetSuccess("Budget saved successfully!");
  };

  const monthOptions = useMemo(() => {
    const options: { label: string; value: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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

  const monthlyTransactions = useMemo(
    () => transactions.filter((t) => t.date && t.date.startsWith(selectedMonth)),
    [transactions, selectedMonth]
  );

  const totalIncome = useMemo(
    () =>
      monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const totalExpense = useMemo(
    () =>
      monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const totalBalance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);
  const remainingBudget = monthlyBudget - totalExpense;

  const budgetPercentage = monthlyBudget > 0 ? Math.min((totalExpense / monthlyBudget) * 100, 100) : 0;

  const budgetProgressColor =
    budgetPercentage >= 90
      ? "bg-red-500"
      : budgetPercentage >= 70
      ? "bg-yellow-500"
      : "bg-green-500";

  const chartData = useMemo(() => {
    const total = totalIncome + totalExpense;
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const incomeLength = total === 0 ? 0 : (totalIncome / total) * circumference;
    const expenseLength = total === 0 ? 0 : (totalExpense / total) * circumference;

    return {
      total,
      radius,
      circumference,
      incomeLength,
      expenseLength,
      incomePercentage: total === 0 ? 0 : Math.round((totalIncome / total) * 100),
      expensePercentage: total === 0 ? 0 : Math.round((totalExpense / total) * 100),
    };
  }, [totalIncome, totalExpense]);

  const summaryItems: SummaryItem[] = [
    {
      title: "Total Income",
      amount: formatCurrency(totalIncome),
      icon: ArrowUpFromLine,
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Expense",
      amount: formatCurrency(totalExpense),
      icon: ArrowDownFromLine,
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
    },
    {
      title: "Total Balance",
      amount: formatCurrency(totalBalance),
      icon: Wallet,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />

      <main className="lg:ml-72 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
            <Card className="shadow-sm flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Hello Adunade 👋</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-slate-400">Here is what's happening with your finances.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm p-4 flex flex-col justify-center gap-2 md:w-80">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Selected Month</span>
              <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val || selectedMonth)}>
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

          <Summary items={summaryItems} />

          <BudgetSection
            monthlyBudget={monthlyBudget}
            onBudgetChange={setMonthlyBudget}
            handleSaveBudget={handleSaveBudget}
            budgetSuccess={budgetSuccess}
            totalExpense={totalExpense}
            remainingBudget={remainingBudget}
            budgetPercentage={budgetPercentage}
            budgetProgressColor={budgetProgressColor}
          />

          <BarChart
            chartData={chartData}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalBalance={totalBalance}
          />
        </div>
      </main>
    </div>
  );
}
