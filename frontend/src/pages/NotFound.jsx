import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">404</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">The page you requested does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  )
}
