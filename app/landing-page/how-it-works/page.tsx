'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Wallet, PlusCircle, ChartNoAxesColumn, Target, CreditCard } from 'lucide-react'
import Navbar from '@/components/ui/navbar'

const howItWorksData = [
  {
    id: 1,
    icon: Wallet,
    title: 'Sign Up',
    description: 'Create your BudgetPal account to start tracking your money, set budgets, and building better financial habits',
    gradient: 'from-green-800 to-green-300'
  },
  {
    id: 2,
    icon: PlusCircle,
    title: 'Add Transactions',
    description: 'Add your income and expenses in seconds to keep your financial data accurate and up to date.',
    gradient: 'from-purple-800 to-purple-300'
  },

  {
    id:3,
    icon:CreditCard,
    title: 'View Transactions.',
    description: 'Filter and manage all your saved transactions to understand where your money is coming from and where it is going.',
    gradient: 'from-blue-800 to-blue-300'
  },
  {
    id: 4,
    icon: ChartNoAxesColumn,
    title: 'Track & Organize',
    description: 'Organize your data and keep all your income and expenses in one place, organize your transactions by category, and stay in control of your finances every day.',
    gradient: 'from-yellow-800 to-yellow-300'
  },
  {
    id: 5,
    icon: Target,
    title: 'Set Budgets',
    description:
      'Set a monthly budget to help you track your expenses, control your spending and see how much you have left for the month.',
    gradient: 'from-pink-800 to-pink-300'
  }
]

export default function HowItWorksSection () {
  return (
    <>
      <Navbar />
      <section className='max-w-6xl mx-auto bg-background py-10 md:py-16'>
        <div className='px-5'>
          <h1 className='text-3xl md:text-4xl font-bold text-green-700 text-center'>
            Managing your money is simple.
          </h1>

          <p className='mt-4 text-center text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Discover how BudgetPal can help you take control of your money and
            make your goals achievable. BudgetPal makes it easy to manage your
            finances in just a few steps.
          </p>

          <div className='mt-12 grid md:grid-cols-3 gap-6 items-stretch'>
            {howItWorksData.map(howItWorks => (
              <Card
                key={howItWorks.id}
                size='sm'
                className='h-full w-full border-0 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden'
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${howItWorks.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <CardHeader className='relative z-10'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 rounded-full bg-linear-to-br ${howItWorks.gradient} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <howItWorks.icon className='w-5 h-5' />
                    </div>

                    <CardTitle className='font-bold leading-tight'>
                      {howItWorks.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className='relative z-10 flex-1'>
                  <CardDescription className='text-base leading-relaxed text-gray-600'>
                    {howItWorks.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
