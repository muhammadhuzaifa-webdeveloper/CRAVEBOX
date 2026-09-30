import AddCustomerModal from "../components/AddCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal";

import { useMemo, useState, useEffect } from "react";
import { 
  FaSearch, 
  FaChevronDown, 
  FaEdit, 
  FaPlus 
} from "react-icons/fa";
import { api } from "../api/client";

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Inactive: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const AVATAR_TINTS = [
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
];

function initials(name) {
  if (!name) return "CU";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Main Customers Page Component                                     */
/* ------------------------------------------------------------------ */

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 8000);
  };

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.get("/customers");
      setCustomers(
        data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || "N/A",
          address: c.address || "N/A",
          orders: c.orders || 0,
          spent: `Rs. ${Number(c.spent || 0).toLocaleString()}`,
          status: c.status || "Active",
          joined: c.joined ? new Date(c.joined).toLocaleDateString() : "N/A",
        }))
      );
    } catch (err) {
      showToast(err.message || "Failed to load customers.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [customers, query, statusFilter]);

  const handleSave = async (updated) => {
    try {
      await api.put(`/customers/${updated.id}`, {
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        status: updated.status,
      });
      setEditingCustomer(null);
      showToast("Customer details updated!");
      loadCustomers();
    } catch (err) {
      showToast(err.message || "Error updating customer!");
    }
  };

  const handleAddCustomer = async (newCust) => {
    try {
      const created = await api.post("/customers", {
        name: newCust.name,
        email: newCust.email,
        phone: newCust.phone || "",
        status: newCust.status || "Active",
      });
      setIsAddOpen(false);
      showToast(`Customer added. Temporary password: ${created.tempPassword}`);
      loadCustomers();
    } catch (err) {
      showToast(err.message || "Error adding customer!");
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Customers</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage and view your store customers</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 font-semibold text-xs text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer">
            This Month <FaChevronDown className="text-[10px] text-slate-400" />
          </button>
          
          {/* Add Customer Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <FaPlus className="text-[10px]" /> Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{totalCustomers}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Total Customers</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{activeCustomers}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Active</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{totalCustomers - activeCustomers}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Inactive</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">36,531</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Daily Visitors</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-5 py-3.5 font-bold">Customer</th>
                <th className="px-5 py-3.5 font-bold">Contact</th>
                <th className="px-5 py-3.5 font-bold">Address</th>
                <th className="px-5 py-3.5 font-bold">Orders</th>
                <th className="px-5 py-3.5 font-bold">Total Spent</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    Loading customers from database...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No customers match your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-black text-white ${AVATAR_TINTS[i % AVATAR_TINTS.length]}`}
                        >
                          {initials(c.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white whitespace-nowrap">{c.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">Joined {c.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <p>{c.email}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{c.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-[180px] truncate">{c.address}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.orders}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">{c.spent}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setEditingCustomer(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaEdit className="text-[11px]" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <AddCustomerModal
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddCustomer}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl transition-all">
          {toastMessage}
        </div>
      )}
    </div>
  );
}