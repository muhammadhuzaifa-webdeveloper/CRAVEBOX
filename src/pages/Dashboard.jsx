import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import {
  FaChevronDown,
  FaDollarSign,
  FaUserFriends,
  FaClipboardList,
  FaCheckCircle,
  FaSync,
} from "react-icons/fa";

const ACCENTS = {
  indigo: { chip: "bg-indigo-600", stroke: "stroke-indigo-500" },
  amber: { chip: "bg-amber-500", stroke: "stroke-amber-500" },
  cyan: { chip: "bg-cyan-500", stroke: "stroke-cyan-500" },
  emerald: { chip: "bg-emerald-500", stroke: "stroke-emerald-500" },
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildSmoothPath(points, w, h, max) {
  if (!points || points.length === 0) return { d: "", coords: [] };
  const n = points.length;
  const stepX = w / (n - 1 || 1);
  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: h - (p / (max || 1)) * h,
  }));

  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midX = (curr.x + next.x) / 2;
    d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return { d, coords };
}

function Sparkline({ data = [4, 6, 5, 8, 6, 9], accent }) {
  const w = 90;
  const h = 32;
  const max = Math.max(...data, 1) * 1.15;
  const { d } = buildSmoothPath(data, w, h, max);
  const a = ACCENTS[accent] || ACCENTS.indigo;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 sm:w-20 h-8 overflow-visible">
      <path d={d} fill="none" strokeWidth="2.5" className={a.stroke} strokeLinecap="round" />
    </svg>
  );
}

function SummaryChart({ data = [1.8, 3.4, 5.9, 6.6, 2.1, 3.9, 4.5], labels = DAY_LABELS }) {
  const w = 640;
  const h = 220;
  const max = Math.max(...data, 10);
  const { d, coords } = buildSmoothPath(data, w, h, max);
  const areaD = coords.length ? `${d} L ${coords[coords.length - 1].x} ${h} L 0 ${h} Z` : "";
  const peakIndex = data.indexOf(Math.max(...data));
  const peak = coords[peakIndex] || { x: 0, y: 0 };

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 pb-6">
        <span>{max.toFixed(0)}k</span>
        <span>{(max * 0.75).toFixed(0)}k</span>
        <span>{(max * 0.5).toFixed(0)}k</span>
        <span>{(max * 0.25).toFixed(0)}k</span>
        <span>0k</span>
      </div>

      <div className="pl-8 sm:pl-12">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[180px] sm:h-[220px] lg:h-[240px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="summaryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              x2={w}
              y1={(h / 4) * i}
              y2={(h / 4) * i}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="1"
            />
          ))}

          {areaD && <path d={areaD} fill="url(#summaryFill)" className="text-indigo-500" />}
          {d && <path d={d} fill="none" className="stroke-indigo-500" strokeWidth="3" strokeLinecap="round" />}
          {coords.length > 0 && (
            <circle cx={peak.x} cy={peak.y} r="5" className="fill-white dark:fill-slate-900 stroke-indigo-500" strokeWidth="3" />
          )}
        </svg>

        {coords.length > 0 && (
          <div
            className="absolute -translate-x-1/2 -translate-y-[130%] bg-indigo-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap pointer-events-none"
            style={{ left: `calc(${(peak.x / w) * 100}% + 2rem)`, top: `${(peak.y / h) * 100}%` }}
          >
            {(data[peakIndex] || 0).toFixed(1)}K Earning
          </div>
        )}

        <div className="flex justify-between mt-3 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Strict parser for money values
const parseAmount = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const cleaned = parseFloat(val.replace(/[^0-9.-]+/g, ""));
    return isNaN(cleaned) ? 0 : cleaned;
  }
  return 0;
};

export default function Dashboard() {
  const { orders } = useOrders();
  const { user, isAdmin } = useAuth();
  const [range, setRange] = useState("All Time");
  const [isSyncing, setIsSyncing] = useState(false);

  // useMemo ensures calculations auto-run instantly whenever orders change
  const computedData = useMemo(() => {
    const now = new Date();

    const filteredOrders = orders.filter((item) => {
      if (range === "All Time") return true;
      const orderDateRaw = item.created_at || item.date || item.order_date;
      if (!orderDateRaw) return true;

      const orderDate = new Date(orderDateRaw);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      if (range === "This Week") return diffDays <= 7;
      if (range === "Last Week") return diffDays > 7 && diffDays <= 14;
      return true;
    });

    const money = (o) => (o.status === "Cancelled" ? 0 : parseAmount(o.total ?? o.amount ?? 0));
    const totalEarning = filteredOrders.reduce((acc, o) => acc + money(o), 0);
    const uniqueCustomers = new Set(filteredOrders.map((o) => o.customer || o.id)).size;
    const delivered = filteredOrders.filter((o) => o.status === "Delivered").length;

    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayOrders = [0, 0, 0, 0, 0, 0, 0];
    const dayDelivered = [0, 0, 0, 0, 0, 0, 0];
    filteredOrders.forEach((o) => {
      const day = new Date(o.date).getDay();
      if (isNaN(day)) return;
      dayTotals[day] += money(o) / 1000;
      dayOrders[day] += 1;
      if (o.status === "Delivered") dayDelivered[day] += 1;
    });

    // Week over week change (this 7 days vs the 7 days before)
    const inWindow = (o, from, to) => {
      const d = (now - new Date(o.date)) / 864e5;
      return d > from && d <= to;
    };
    const cur = orders.filter((o) => inWindow(o, -1, 7));
    const prev = orders.filter((o) => inWindow(o, 7, 14));
    const sum = (list) => list.reduce((a, o) => a + money(o), 0);
    const uniq = (list) => new Set(list.map((o) => o.customer || o.id)).size;
    const del = (list) => list.filter((o) => o.status === "Delivered").length;
    const delta = (c, p) => {
      if (!p) return c ? { text: "New", trend: "up" } : { text: "0%", trend: "up" };
      const v = ((c - p) / p) * 100;
      return { text: `${Math.abs(v).toFixed(1)}%`, trend: v >= 0 ? "up" : "down" };
    };

    return {
      stats: { totalEarning, dailyCustomers: uniqueCustomers, newOrders: filteredOrders.length, delivered },
      deltas: {
        earning: delta(sum(cur), sum(prev)),
        customers: delta(uniq(cur), uniq(prev)),
        orders: delta(cur.length, prev.length),
        delivered: delta(del(cur), del(prev)),
      },
      sparks: { earning: dayTotals, orders: dayOrders, delivered: dayDelivered },
      recentOrders: filteredOrders.slice(0, 5),
      weeklyEarnings: dayTotals,
    };
  }, [orders, range]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 500);
  };

  const { stats, deltas, sparks } = computedData;
  const fmt = (n) => `Rs. ${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const statCardsData = [
    { label: isAdmin ? "Total Earning" : "Total Spent", value: fmt(stats.totalEarning), ...deltas.earning, icon: FaDollarSign, accent: "indigo", spark: sparks.earning },
    { label: isAdmin ? "Daily Customers" : "Orders Placed", value: (isAdmin ? stats.dailyCustomers : stats.newOrders).toLocaleString(), ...(isAdmin ? deltas.customers : deltas.orders), icon: FaUserFriends, accent: "amber", spark: sparks.orders },
    { label: "New Orders", value: stats.newOrders.toLocaleString(), ...deltas.orders, icon: FaClipboardList, accent: "cyan", spark: sparks.orders },
    { label: "Delivered", value: stats.delivered.toLocaleString(), ...deltas.delivered, icon: FaCheckCircle, accent: "emerald", spark: sparks.delivered },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isAdmin ? "Dashboard Overview" : user ? `Welcome, ${user.name.split(" ")[0]}` : "Dashboard Overview"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin ? "Live business reports, analytics & activity metrics." : "Your orders and spending at a glance."}
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleSync}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition rounded-xl px-3.5 py-2 font-semibold text-xs text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
          >
            <FaSync className={`text-[10px] ${isSyncing ? "animate-spin" : ""}`} /> Sync
          </button>
          <button 
            onClick={() => setRange((r) => (r === "This Week" ? "All Time" : "This Week"))}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition rounded-xl px-3.5 py-2 font-semibold text-xs text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
          >
            {range} <FaChevronDown className="text-[10px] text-slate-400" />
          </button>
        </div>
      </div>

      {!user && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl px-5 py-4">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            You are browsing as a guest. Log in to place orders and track them here.
          </p>
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">Log in</Link>
            <Link to="/collection" className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">Browse Menu</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map(({ label, value, text, trend, icon: Icon, accent, spark }) => {
          const a = ACCENTS[accent];
          return (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm ${a.chip}`}>
                  <Icon className="text-base" />
                </div>
                <Sparkline data={spark} accent={accent} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                  {value}
                </span>
                <span className={`text-xs font-bold ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                  {trend === "up" ? "▲" : "▼"} {text}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          Analytics & Live Activity
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {fmt(computedData.stats.totalEarning)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Revenue</p>
                </div>
                <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
                  <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {computedData.stats.newOrders}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Orders</p>
                </div>
              </div>
            </div>

            <SummaryChart data={computedData.weeklyEarnings} labels={DAY_LABELS} />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isAdmin ? "Live Transactions" : "Recent Orders"}
                </h3>
                <Link to="/orders" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3.5">
                {computedData.recentOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No recent transactions available.</p>
                ) : (
                  computedData.recentOrders.map((order, idx) => {
                    const priceVal =
                      order.total ??
                      order.amount ??
                      order.price ??
                      order.totalAmount ??
                      order.total_amount ??
                      0;

                    return (
                      <div 
                        key={order.id || idx} 
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                            #{idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                              {order.customer_name || order.customer || "Guest Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              {order.created_at || order.date || order.order_date
                                ? new Date(order.created_at || order.date || order.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-emerald-500 whitespace-nowrap">
                          +Rs. {parseAmount(priceVal).toLocaleString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}