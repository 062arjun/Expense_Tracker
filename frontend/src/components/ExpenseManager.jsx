import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog.jsx'
import ExpenseFilters from './ExpenseFilters.jsx'
import ExpenseForm from './ExpenseForm.jsx'
import ExpenseTable from './ExpenseTable.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import { expenseService } from '../services/expenseService.js'

const initialFilters = { search: '', category: '', startDate: '', endDate: '', sortBy: 'date', direction: 'desc' }

const validationMessage = (error, fallback) => {
  const validationErrors = error.response?.data?.validationErrors
  const firstValidationError = validationErrors && Object.values(validationErrors)[0]
  return firstValidationError || error.response?.data?.message || fallback
}

export default function ExpenseManager({ showHeader = true, onChanged }) {
  const [expenses, setExpenses] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''))
      setExpenses(await expenseService.list(cleanFilters))
    } catch (error) {
      toast.error(validationMessage(error, 'Unable to load expenses'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [filters])

  const save = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        await expenseService.update(editing.id, payload)
        toast.success('Expense updated')
      } else {
        await expenseService.create(payload)
        toast.success('Expense added')
      }
      setEditing(null)
      await load()
      onChanged?.()
      return true
    } catch (error) {
      toast.error(validationMessage(error, 'Save failed'))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await expenseService.remove(deleting.id)
      toast.success('Expense deleted')
      setDeleting(null)
      await load()
      onChanged?.()
    } catch (error) {
      toast.error(validationMessage(error, 'Delete failed'))
    }
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create, edit, search, filter, sort, and delete your transactions.</p>
        </div>
      )}
      <ExpenseForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} submitting={submitting} />
      <ExpenseFilters filters={filters} setFilters={setFilters} />
      {loading ? <LoadingSpinner label="Loading expenses" /> : <ExpenseTable expenses={expenses} onEdit={setEditing} onDelete={setDeleting} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete expense"
        message="This transaction will be permanently removed."
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
