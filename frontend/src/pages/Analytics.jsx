import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { useAsync } from '../hooks/useAsync.js'
import { currency } from '../utils/format.js'

const colors = ['#14b8a6', '#f97316', '#6366f1', '#ec4899', '#84cc16', '#06b6d4']

export default function Analytics() {
  const { data, loading } = useAsync(async () => {
    const [monthly, categories] = await Promise.all([dashboardService.monthly(), dashboardService.categories()])
    return { monthly, categories }
  }, [])

  if (loading || !data) return <LoadingSpinner label="Loading analytics" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Spending patterns from live backend analytics endpoints.</p>
      </div>
      <section className="panel">
        <h2 className="mb-4 text-lg font-semibold">Monthly trend</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => currency(value)} />
              <Area type="monotone" dataKey="total" stroke="#14b8a6" fill="#99f6e4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="panel">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.categories} dataKey="total" nameKey="category" innerRadius={70} outerRadius={130} label>
                {data.categories.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
