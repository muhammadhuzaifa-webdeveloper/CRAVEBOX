import { useMemo, useState } from "react";
import { FaSearch, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import OrderReceiptModal from "../components/OrderReceiptModal";

const RANGES = ["All Time", "This Week", "Last Week"];
const STATUS_CHOICES = ["Pending", "Processing", "Delivered", "Cancelled"];
const STATUS_FILTERS = ["All", "Delivered", "Processing", "Pending", "Cancelled"];

const STATUS_STYLES = {
  Delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Processing: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Cancelled: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

export default function Orders() {
  const { orders: allOrders = [], loading, error, updateOrderStatus, deleteOrder } = useOrders();
  const { isAdmin } = useAuth();
  const [range, setRange] = useState("All Time");
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  // Date range filter (week starts on Sunday)
  const orders = useMemo(() => {
    if (range === "All Time") return allOrders;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    const from = new Date(start);
    const to = new Date(8.64e15);
    if (range === "Last Week") {
      from.setDate(from.getDate() - 7);
      to.setTime(start.getTime());
    }
    return allOrders.filter((o) => {
      const d = new Date(o.date);
      return d >= from && d < to;
    });
  }, [allOrders, range]);

  const handleStatus = async (order, status) => {
    try {
      await updateOrderStatus(order, status);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete ${order.id}? This cannot be undone.`)) return;
    try {
      await deleteOrder(order);
      setSelected(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Real-time Dynamic Summary Calculation
  const summary = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;

    return [
      { label: "Total Orders", value: total.toLocaleString() },
      { label: "Delivered", value: delivered.toLocaleString() },
      { label: "Processing", value: processing.toLocaleString() },
      { label: "Cancelled", value: cancelled.toLocaleString() },
    ];
  }, [orders]);

  // Dynamic Filtering Logic with Instant Re-render
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const q = query.trim().toLowerCase();
      
      const idMatch = o.id ? o.id.toLowerCase().includes(q) : false;
      const customerMatch = o.customer ? o.customer.toLowerCase().includes(q) : false;
      const itemMatch = o.item ? o.item.toLowerCase().includes(q) : false;

      return matchesStatus && (q === "" || idMatch || customerMatch || itemMatch);
    });
  }, [orders, statusFilter, query]);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{isAdmin ? "Orders" : "My Orders"}</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Filter:</span>
          <button
            onClick={() => setRange((r) => RANGES[(RANGES.indexOf(r) + 1) % RANGES.length])}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {range} <FaChevronDown className="text-[10px] text-slate-400" />
          </button>
        </div>
      </div>

      {/* Dynamic Summary Strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summary.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4"
          >
            <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, customer..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-950 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="px-5 py-3 font-bold">Order ID</th>
                <th className="px-5 py-3 font-bold">Customer</th>
                <th className="px-5 py-3 font-bold">Item</th>
                <th className="px-5 py-3 font-bold">Date</th>
                <th className="px-5 py-3 font-bold">Amount</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id || index}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-xs truncate">
                    {order.item}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {order.date ? new Date(order.date).toLocaleDateString() : ""}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {order.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    {isAdmin ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatus(order, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_CHOICES.map((st) => (
                          <option key={st} value={st} className="text-slate-900">{st}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[order.status] || STATUS_STYLES["Processing"]}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelected(order)}
                      title="View bill"
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      aria-label="View bill"
                    >
                      <FaEllipsisH className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                    {loading ? "Loading orders..." : error || "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <OrderReceiptModal order={selected} onClose={() => setSelected(null)} onDelete={isAdmin ? handleDelete : undefined} />
    </div>
  );
}