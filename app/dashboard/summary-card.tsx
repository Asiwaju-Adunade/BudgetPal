"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface SummaryItem {
  title: string;
  amount: string;
  icon: LucideIcon;
  bg: string;
  text: string;
}

export default function Summary({ items }: { items: SummaryItem[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map((item) => (
        <Card key={item.title} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-slate-400">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{item.amount}</p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.text}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
