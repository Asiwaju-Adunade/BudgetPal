import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  total: number;
  radius: number;
  circumference: number;
  incomeLength: number;
  expenseLength: number;
  incomePercentage: number;
  expensePercentage: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function BarChart({
  chartData,
  totalIncome,
  totalExpense,
  totalBalance,
}: {
  chartData: ChartData;
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Overview</CardTitle>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Income vs expense for the selected month
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="relative flex items-center justify-center">
              <svg width="240" height="240" viewBox="0 0 240 240">
                <circle
                  cx="120"
                  cy="120"
                  r={chartData.radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="28"
                  className="dark:stroke-slate-700"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={chartData.radius}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeDasharray={`${chartData.incomeLength} ${chartData.circumference}`}
                  transform="rotate(-90 120 120)"
                />

                <circle
                  cx="120"
                  cy="120"
                  r={chartData.radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeDasharray={`${chartData.expenseLength} ${chartData.circumference}`}
                  strokeDashoffset={-chartData.incomeLength}
                  transform="rotate(-90 120 120)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-slate-400">Total volume</span>
                <span className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  {formatCurrency(chartData.total)}
                </span>
              </div>
            </div>

            {chartData.total === 0 ? (
              <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
                No transaction data for this month.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 w-full">
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Income</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                      {formatCurrency(totalIncome)}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {chartData.incomePercentage}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-red-50 dark:bg-red-950/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">Expense</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                      {formatCurrency(totalExpense)}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400">
                      {chartData.expensePercentage}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400">Total Income</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalIncome)}</p>
              <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">{chartData.incomePercentage}% of total volume</p>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400">Total Expense</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalExpense)}</p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{chartData.expensePercentage}% of total volume</p>
            </div>

            <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400">Available Balance</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalBalance)}</p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Remaining balance after expenses</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
