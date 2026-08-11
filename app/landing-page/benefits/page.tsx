"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ChartPie, CreditCard, TrendingUp, Target, Lock } from "lucide-react";
import Navbar from "@/components/ui/navbar";

const benefitsData = [
    {
        id: 1,
        icon: TrendingUp,
        title: "Take Control of Your Finances",
        description: "Know exactly where your money goes and make better financial decisions.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: 2,
        icon: CreditCard,
        title: "Track Every Expense",
        description: "Finally see where your money is going with automatic transaction tracking and detailed spending insights.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: 3,
        icon: BarChart3,
        title: "Smart Budgeting Made Simple",
        description: "Create budgets that work for you with smart suggestions, customizable categories, and real-time progress updates.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: 4,
        icon: ChartPie,
        title: "Save More",
        description: "Identify spending patterns and find ways to save more each month.",
        gradient: "from-green-800 to-green-300"
    },
    {
        id: 5,
        icon: Target,
        title: "Stay on Track",
        description: "Set budgets and get reminders to stay on track with your goals.",
        gradient: "from-blue-800 to-blue-300"
    },

    {
        id: 6,
        icon: Lock,
        title: "Your Data is Safe",
        description: "We keep your data private and secure. You're in control.",
        gradient: "from-purple-500 to-pink-500"
    },
];

export default function BenefitsSection() {
    return (
        <>
        <Navbar />
        <section className="md:py-10 py-5 max-w-6xl mx-auto bg-background">
            <div className="mx-auto px-5">
                <h1 className="text-3xl md:text-4xl font-bold  text-green-700 text-center pt-5">
                   Why choose BudgetPal?
                </h1>
                <p className="text-center text-xl font-medium pt-4">
                    Discover how BudgetPal can help you take control of your money and achieve your goals
                </p>

                <div className="grid md:grid-cols-3 gap-4 md:gap-8 pt-10 justify-items-center">
                    {benefitsData.map((benefit) => (
                        <Card key={benefit.id} size="sm" className="border-0 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden mx-auto">
                            <div className={`absolute inset-0 bg-linear-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            <CardHeader >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-linear-to-br ${benefit.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="font-bold">{benefit.title}</CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent className="">
                                <CardDescription className="text-base">
                                    {benefit.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        </>
    );
}
