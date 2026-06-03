import { Edit3, Trash2 } from 'lucide-react'
import { currency, displayDate } from '../utils/format.js'

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="panel overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Note</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr key={expense.id} className="text-slate-700 dark:text-slate-200">
                <td className="px-5 py-4">{displayDate(expense.expenseDate)}</td>
                <td className="px-5 py-4 font-semibold">{expense.category}</td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{expense.note || 'No note'}</td>
                <td className="px-5 py-4 text-right font-semibold">{currency(expense.amount)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="btn-secondary px-3" onClick={() => onEdit(expense)} aria-label="Edit expense">
                      <Edit3 size={16} />
                    </button>
                    <button className="btn-secondary px-3 text-red-600" onClick={() => onDelete(expense)} aria-label="Delete expense">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500 dark:text-slate-400" colSpan="5">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
