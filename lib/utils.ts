import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "@/types/expense";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const KEY = "budgetpal-transactions";

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(KEY, JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};
