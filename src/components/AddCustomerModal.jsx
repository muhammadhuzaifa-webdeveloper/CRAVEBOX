import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function AddCustomerModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter Name and Email.");
      return;
    }

    // Naya customer object ready kar rahe hain
    const newCustomer = {
      id: Date.now(), // Unique ID
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "N/A",
      address: address.trim() || "N/A",
      orders: 0,
      spent: "$0.00",
      status: status,
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    // Main parent function (Customers.jsx) ko data bhej rahe hain
    onAdd(newCustomer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Add New Customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Raza"
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ali.raza@example.com"
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 0000000"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Gulshan, Karachi"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}