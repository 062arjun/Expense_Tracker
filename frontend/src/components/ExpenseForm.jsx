import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import { todayInput } from '../utils/format.js'
import { categories } from '../constants/categories.js'

const initialForm = { amount: '', category: '', expenseDate: todayInput(), note: '' }

export default function ExpenseForm({ editing, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    setForm(editing ? {
      amount: editing.amount,
      category: editing.category,
      expenseDate: editing.expenseDate,
      note: editing.note || ''
    } : initialForm)
  }, [editing])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const saved = await onSubmit({ ...form, amount: Number(form.amount) })
    if (saved && !editing) setForm(initialForm)
  }

  return (
    <form onSubmit={submit} className="panel space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{editing ? 'Edit expense' : 'Add expense'}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Amount
          <input className="input mt-1" name="amount" type="number" min="0.01" step="0.01" required value={form.amount} onChange={update} />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Category
          <select className="input mt-1" name="category" required value={form.category} onChange={update}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Date
          <input className="input mt-1" name="expenseDate" type="date" required value={form.expenseDate} onChange={update} />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Note
          <input className="input mt-1" name="note" value={form.note} onChange={update} placeholder="Optional details" />
        </label>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        {editing && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
        <button className="btn-primary" disabled={submitting}>
          <Save size={16} /> {editing ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
