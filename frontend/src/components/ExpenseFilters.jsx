import { Search } from 'lucide-react'

export default function ExpenseFilters({ filters, setFilters }) {
  const update = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))

  return (
    <div className="panel grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 xl:col-span-2">
        Search
        <div className="relative mt-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input className="input pl-9" name="search" value={filters.search} onChange={update} placeholder="Category or note" />
        </div>
      </label>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Category
        <input className="input mt-1" name="category" value={filters.category} onChange={update} />
      </label>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        From
        <input className="input mt-1" name="startDate" type="date" value={filters.startDate} onChange={update} />
      </label>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        To
        <input className="input mt-1" name="endDate" type="date" value={filters.endDate} onChange={update} />
      </label>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Sort
        <select className="input mt-1" name="sortBy" value={filters.sortBy} onChange={update}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </label>
    </div>
  )
}
