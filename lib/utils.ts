import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "@/types/expense";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saveTransactions(userId: string, transactions: Transaction[]) {
   if (typeof window === "undefined") return;
  localStorage.setItem(
    `transactions_${userId}`,
    JSON.stringify(transactions)
  );
}

export function getTransactions(userId: string): Transaction[] {
  if (typeof window === "undefined") return [];

   const data = localStorage.getItem(`transactions_${userId}`);
  return data ? JSON.parse(data) : [];
};
