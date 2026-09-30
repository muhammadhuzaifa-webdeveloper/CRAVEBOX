import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditCustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(customer);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Edit Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Phone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={handleChange("phone")}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={handleChange("address")}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={handleChange("status")}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}