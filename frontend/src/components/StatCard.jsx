export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-md bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/10 dark:text-brand-500">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}
