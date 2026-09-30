import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Field, ErrorNote, inputClass } from "../components/AuthLayout";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    currentPassword: "",
    newPassword: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      await updateProfile({ ...form, newPassword: form.newPassword || undefined });
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      setMsg({ type: "ok", text: "Profile updated successfully." });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Setting</h1>

      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">{user?.email}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize">{user?.role}</span>
        </div>

        {msg.type === "error" && <ErrorNote message={msg.text} />}
        {msg.type === "ok" && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm px-3.5 py-2.5">{msg.text}</div>
        )}

        <Field label="Full name"><input required className={inputClass} value={form.name} onChange={set("name")} /></Field>
        <Field label="Phone"><input className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+92 300 1234567" /></Field>
        <Field label="Default address"><input className={inputClass} value={form.address} onChange={set("address")} placeholder="House, street, city" /></Field>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid sm:grid-cols-2 gap-3">
          <Field label="Current password"><input type="password" autoComplete="current-password" className={inputClass} value={form.currentPassword} onChange={set("currentPassword")} /></Field>
          <Field label="New password"><input type="password" autoComplete="new-password" className={inputClass} value={form.newPassword} onChange={set("newPassword")} placeholder="Leave empty to keep" /></Field>
        </div>

        <button disabled={busy} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 transition cursor-pointer">
          {busy ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
