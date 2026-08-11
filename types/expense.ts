export type TransactionType = "income" | "expense";

export type Category =
  | "food"
  | "transportation"
  | "data"
  | "bills"
  | "subscription"
  | "groceries"
  | "shopping"
  | "education"
  | "fashion"
  | "beauty"
  | "utilities"
  | "health"
  | "rent"
  | "entertainment"
  | "car"
  | "miscellaneous"
  | "salary"
  | "investment"
  | "bonus"
  | "allowance"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}