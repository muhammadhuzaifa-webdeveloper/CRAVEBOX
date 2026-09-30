import { FaUtensils } from "react-icons/fa";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <FaUtensils />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Crave<span className="text-indigo-600 dark:text-indigo-400">Box</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">{footer}</p>
      </div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm px-3.5 py-2.5">
      {message}
    </div>
  );
}
