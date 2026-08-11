import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

interface BudgetSectionProps {
  monthlyBudget: number;
  onBudgetChange: (value: number) => void;
  handleSaveBudget: () => void;
  budgetSuccess: string;
  totalExpense: number;
  remainingBudget: number;
  budgetPercentage: number;
  budgetProgressColor: string;
}

export default function BudgetSection({
  monthlyBudget,
  onBudgetChange,
  handleSaveBudget,
  budgetSuccess,
  totalExpense,
  remainingBudget,
  budgetPercentage,
  budgetProgressColor,
}: BudgetSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Budget</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {formatCurrency(monthlyBudget)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-slate-400">Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {monthlyBudget > 0 ? `${Math.round((totalExpense / monthlyBudget) * 100)}%` : "0%"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${budgetProgressColor}`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
              <span>Spent: {formatCurrency(totalExpense)}</span>
              <span>Remaining: {formatCurrency(remainingBudget)}</span>
            </div>
          </div>

          {remainingBudget < 0 ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 p-3 text-red-700 dark:text-red-400">
              You have exceeded your monthly budget by <span className="font-semibold">{formatCurrency(Math.abs(remainingBudget))}</span>.
            </div>
          ) : (
            <div className="rounded-2xl border border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10 p-3 text-green-700 dark:text-green-400">
              You still have <span className="font-semibold">{formatCurrency(remainingBudget)}</span> available for this month.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Set Budget</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm block font-medium text-gray-700 dark:text-slate-300">Monthly Budget</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-slate-900 dark:text-slate-100"
              placeholder="0.00"
            />
          </div>

          <button
            onClick={handleSaveBudget}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium cursor-pointer text-white transition hover:bg-green-400 hover:text-black"
          >
            Save Budget
          </button>

          {budgetSuccess && (
            <p className="text-sm text-green-600 text-center font-medium animate-pulse">{budgetSuccess}</p>
          )}

          <p className="text-xs leading-relaxed text-gray-500 dark:text-slate-400">
            Set a monthly spending budget to help you stay on track with your financial goals.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
