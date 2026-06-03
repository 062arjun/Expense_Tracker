import { ShieldCheck, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your authenticated account details.</p>
      </div>
      <section className="panel max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-brand-50 p-4 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500">
            <UserCircle size={36} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-800">
          <ShieldCheck className="text-brand-600" size={22} />
          <div>
            <p className="font-semibold">Role: {user?.role}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Requests are authorized with a JWT bearer token.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
