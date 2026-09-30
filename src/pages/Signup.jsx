import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { Field, ErrorNote, inputClass } from "../components/AuthLayout";
import { useAuth, homePathFor } from "../context/AuthContext";

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const u = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate(location.state?.from || homePathFor(u.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to order your favourite food."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Log in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <ErrorNote message={error} />
        <Field label="Full name">
          <input required className={inputClass} placeholder="Ayesha Khan" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Email">
          <input type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Phone (optional)">
          <input className={inputClass} placeholder="+92 300 1234567" value={form.phone} onChange={set("phone")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password">
            <input type="password" required autoComplete="new-password" className={inputClass} placeholder="Min. 6 chars" value={form.password} onChange={set("password")} />
          </Field>
          <Field label="Confirm">
            <input type="password" required autoComplete="new-password" className={inputClass} placeholder="Repeat" value={form.confirm} onChange={set("confirm")} />
          </Field>
        </div>
        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 transition-colors cursor-pointer">
          {busy ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthLayout>
  );
}
