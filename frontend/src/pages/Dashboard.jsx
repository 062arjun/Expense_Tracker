import { BarChart3, CalendarDays, ReceiptText, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ExpenseManager from '../components/ExpenseManager.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import StatCard from '../components/StatCard.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { useAsync } from '../hooks/useAsync.js'
import { currency, displayDate } from '../utils/format.js'

const colors = ['#14b8a6', '#f97316', '#6366f1', '#ec4899', '#84cc16', '#06b6d4']

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading } = useAsync(async () => {
    const [summary, monthly, categories, recent] = await Promise.all([
      dashboardService.summary(),
      dashboardService.monthly(),
      dashboardService.categories(),
      dashboardService.recent()
    ])
    return { summary, monthly, categories, recent }
  }, [refreshKey])

  if (loading || !data) return <LoadingSpinner label="Loading dashboard" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Live totals from your secured backend account.</p>
      </div>
      <ExpenseManager showHeader={false} onChanged={() => setRefreshKey((current) => current + 1)} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Expenses" value={currency(data.summary.totalExpenses)} icon={Wallet} />
        <StatCard label="This Month" value={currency(data.summary.monthlyExpenses)} icon={CalendarDays} />
        <StatCard label="Transactions" value={data.summary.transactionCount} icon={ReceiptText} />
        <StatCard label="Average Expense" value={currency(data.summary.averageExpense)} icon={BarChart3} />
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <section className="panel xl:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Monthly trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Category breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="total" data={data.categories} nameKey="category" outerRadius={110} label>
                  {data.categories.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="panel">
        <h2 className="mb-4 text-lg font-semibold">Recent transactions</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.recent.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold">{expense.category}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{displayDate(expense.expenseDate)} · {expense.note || 'No note'}</p>
              </div>
              <p className="font-semibold">{currency(expense.amount)}</p>
            </div>
          ))}
          {data.recent.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No recent transactions.</p>}
        </div>
      </section>
    </div>
  )
}
