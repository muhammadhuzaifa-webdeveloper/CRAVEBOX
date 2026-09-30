import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { Field, ErrorNote, inputClass } from "../components/AuthLayout";
import { useAuth, homePathFor } from "../context/AuthContext";

const ROLES = [
  { value: "client", label: "Client" },
  { value: "admin", label: "Admin" },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || "client");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from || homePathFor(user.role)} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(form.email, form.password, role);
      const target = location.state?.from;
      navigate(target && target !== "/login" ? target : homePathFor(u.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={role === "admin" ? "Log in to manage orders, menu and reports." : "Log in to place and track your orders."}
      footer={
        role === "client" ? (
          <>New here? <Link to="/signup" state={location.state} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Create an account</Link></>
        ) : (
          <>Customer? <button type="button" onClick={() => setRole("client")} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Switch to client login</button></>
        )
      }
    >
      <div className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-xl bg-slate-100 dark:bg-slate-800" role="tablist" aria-label="Login as">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            role="tab"
            aria-selected={role === r.value}
            onClick={() => { setRole(r.value); setError(""); }}
            className={`py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              role === r.value
                ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {location.state?.notice && !error && (
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-sm px-3.5 py-2.5">
            {location.state.notice}
          </div>
        )}
        <ErrorNote message={error} />
        <Field label="Email">
          <input type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Password">
          <input type="password" required autoComplete="current-password" className={inputClass} placeholder="••••••••"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 transition-colors cursor-pointer">
          {busy ? "Logging in..." : `Log in as ${role === "admin" ? "Admin" : "Client"}`}
        </button>
      </form>
    </AuthLayout>
  );
}
