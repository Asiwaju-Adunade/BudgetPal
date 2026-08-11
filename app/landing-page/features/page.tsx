"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Tags, ChartNoAxesColumn, Target, ShieldKeyhole, TagPlus } from "lucide-react";
import Navbar from "@/components/ui/navbar";
const featuresData = [
    {
        id: 1,
        icon: Wallet,
        title: "Track Income & Expenses",
        description: "Easily add and track your daily income and expenses in seconds.",
        gradient: "from-green-800 to-green-300"
    },
    {
        id: 2,
        icon: ChartNoAxesColumn,
        title: "Visualize Spending",
        description: "Get clear insights with beautiful charts and understand where your money goes.",
        gradient: "from-purple-800 to-purple-300"
    },
    {
        id: 3,
        icon: Tags,
        title: "Categories & Budgets",
        description: "Organize transactions into categories and set budgets that work for you.",
        gradient: "from-yellow-800 to-yellow-300"
    },
    {
        id: 4,
        icon: Target,
        title: "Achieve Goals",
        description: "Set savings goals and stay motivated and watch your savings grow.",
        gradient: "from-orange-800 to-orange-300"
    },
    {
        id: 5,
        icon: ShieldKeyhole,
        title: "Secure & Private",
        description: "Your financial data is encrypted and stored securely. We never share your personal information. Your data is safe with us.",
        gradient: "from-green-600 to-green-200"
    },
    {
        id: 6,
        icon:TagPlus,
        title: "Free and easy to use",
        description: "BudgetPal is completely free to use and easy to navigate. You can start tracking your expenses in seconds.",
        gradient: "from-blue-600 to-blue-200"
    }
];

export default function FeaturesSection() {
    return (
        <>
        <Navbar />
        <section className="md:py-10 py-5 max-w-6xl mx-auto bg-background">
            <div className="mx-auto px-5">
                <h1 className="text-3xl md:text-4xl font-bold text-green-700  text-center pt-5">
                    Everything you need to manage your finances.
                </h1>
                 <p className="text-center text-lg md:text-xl font-medium text-gray-600 mt-3">
                     BudgetPal makes it easy to take control of your finances in just a few steps.
                </p>
                <div className="grid md:grid-cols-3 gap-4 md:gap-8 pt-10 justify-items-center">
                    {featuresData.map((feature) => (
                        <Card key={feature.id} size="sm" className="border-0 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden mx-auto">
                                   <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                   <CardHeader >
                                   <div className="flex items-center gap-3">
                                       <div className={`w-10 h-10 rounded-full bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                                           <feature.icon className="w-6 h-6" />
                                       </div>
                                       <CardTitle className="font-bold">{feature.title}</CardTitle>
                                   </div>
                                   </CardHeader>
                                   <CardContent>
                                       <CardDescription className="text-base">
                                           {feature.description}
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
