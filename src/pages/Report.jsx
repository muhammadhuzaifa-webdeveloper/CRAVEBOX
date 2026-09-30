import { useState, useMemo } from "react";
import { useOrders } from "../context/OrdersContext";
import { FaChevronDown, FaArrowUp, FaArrowDown, FaDownload } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Real report data, computed from the orders in MongoDB              */
/* ------------------------------------------------------------------ */

const RANGE_MONTHS = { "Last 8 Months": 8, "Last 12 Months": 12 };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CATEGORY_ACCENTS = ["bg-indigo-500", "bg-cyan-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500", "bg-violet-500"];
const STATUS_COLORS = { Delivered: "#6366f1", Processing: "#06b6d4", Pending: "#f59e0b", Cancelled: "#f43f5e" };
const rs = (n) => `Rs. ${Math.round(n).toLocaleString()}`;

function buildReport(orders, months) {
  const now = new Date();
  const startOf = (offset) => new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const periodStart = startOf(months - 1);
  const prevStart = startOf(months * 2 - 1);

  const inCurrent = orders.filter((o) => new Date(o.date) >= periodStart);
  const inPrev = orders.filter((o) => new Date(o.date) >= prevStart && new Date(o.date) < periodStart);
  const paid = (list) => list.filter((o) => o.status !== "Cancelled");
  const revenueOf = (list) => paid(list).reduce((a, o) => a + (o.total || 0), 0);

  const change = (cur, prev, invert = false) => {
    if (!prev) return { delta: cur ? "New" : "0%", trend: "up" };
    const v = ((cur - prev) / prev) * 100;
    return { delta: `${Math.abs(v).toFixed(1)}%`, trend: (v >= 0) !== invert ? "up" : "down" };
  };

  const avg = (list) => (paid(list).length ? revenueOf(list) / paid(list).length : 0);
  const cancelRate = (list) => (list.length ? (list.filter((o) => o.status === "Cancelled").length / list.length) * 100 : 0);

  const summary = [
    { label: "Total Revenue", value: rs(revenueOf(inCurrent)), ...change(revenueOf(inCurrent), revenueOf(inPrev)) },
    { label: "Total Orders", value: inCurrent.length.toLocaleString(), ...change(inCurrent.length, inPrev.length) },
    { label: "Avg. Order Value", value: rs(avg(inCurrent)), ...change(avg(inCurrent), avg(inPrev)) },
    { label: "Cancel Rate", value: `${cancelRate(inCurrent).toFixed(1)}%`, ...change(cancelRate(inCurrent), cancelRate(inPrev), true) },
  ];

  const labels = [];
  const revenue = [];
  for (let i = months - 1; i >= 0; i--) {
    const from = startOf(i);
    const to = startOf(i - 1);
    labels.push(MONTH_NAMES[from.getMonth()]);
    revenue.push(revenueOf(orders.filter((o) => new Date(o.date) >= from && new Date(o.date) < to)) / 1000);
  }

  const byCategory = {};
  const byProduct = {};
  paid(inCurrent).forEach((o) =>
    (o.items || []).forEach((i) => {
      const line = i.price * i.quantity;
      byCategory[i.category || "Other"] = (byCategory[i.category || "Other"] || 0) + line;
      const p = (byProduct[i.title] ||= { name: i.title, sold: 0, revenue: 0 });
      p.sold += i.quantity;
      p.revenue += line;
    })
  );

  const categories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, v], idx) => ({ label, value: Math.round((v / 1000) * 10) / 10, accent: CATEGORY_ACCENTS[idx % CATEGORY_ACCENTS.length] }));

  const status = Object.keys(STATUS_COLORS).map((label) => ({
    label,
    color: STATUS_COLORS[label],
    value: inCurrent.length ? Math.round((inCurrent.filter((o) => o.status === label).length / inCurrent.length) * 100) : 0,
  }));

  const topProducts = Object.values(byProduct)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({ ...p, revenue: rs(p.revenue) }));

  return { summary, labels, revenue, categories, status, topProducts };
}

/* ------------------------------------------------------------------ */
/*  Chart helpers — plain SVG, no charting dependency needed.        */
/* ------------------------------------------------------------------ */

function buildSmoothPath(points, w, h, max) {
  const n = points.length;
  const stepX = w / (n - 1);
  const coords = points.map((p, i) => ({ x: i * stepX, y: h - (p / max) * h }));
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midX = (curr.x + next.x) / 2;
    d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return { d, coords };
}

function RevenueChart({ data, labels }) {
  const w = 760;
  const h = 220;
  const max = (Math.max(...data) || 1) * 1.2;
  const { d, coords } = buildSmoothPath(data, w, h, max);
  const areaD = `${d} L ${coords[coords.length - 1].x} ${h} L 0 ${h} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: "220px" }}>
        <defs>
          <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
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
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
        ))}
        <path d={areaD} fill="url(#reportRevenueFill)" className="text-indigo-500" />
        <path d={d} fill="none" className="stroke-indigo-500" strokeWidth="3" strokeLinecap="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="4" className="fill-white dark:fill-slate-900 stroke-indigo-500" strokeWidth="2.5" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 0) || 1;
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="text-slate-400 dark:text-slate-500">{d.value}K</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${d.accent}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const size = 160;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offsets = data.reduce((acc, d, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / 100) * circumference], []);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-slate-100 dark:stroke-slate-800" />
        {data.map((d, idx) => {
          const offsetAcc = offsets[idx];
          const dash = (d.value / 100) * circumference;
          const circle = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
              strokeLinecap="butt"
            />
          );
          return circle;
        })}
      </svg>

      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{d.label}</span>
            <span className="text-slate-400 dark:text-slate-500">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Report page                                                      */
/* ------------------------------------------------------------------ */

export default function Report() {
  const { orders } = useOrders();
  const [range, setRange] = useState("Last 8 Months");
  const currentData = useMemo(() => buildReport(orders, RANGE_MONTHS[range]), [orders, range]);

  // Export CSV Handler
  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    currentData.summary.forEach((item) => {
      csvContent += `"${item.label}","${item.value}"\n`;
    });

    csvContent += "\nTop Performing Items,Units Sold,Revenue\n";
    currentData.topProducts.forEach((prod) => {
      csvContent += `"${prod.name}",${prod.sold},"${prod.revenue}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${range.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Report</h1>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setRange((r) => (r === "Last 8 Months" ? "Last 12 Months" : "Last 8 Months"))}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {range} <FaChevronDown className="text-[10px] text-slate-400" />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-1.5 font-semibold transition-colors cursor-pointer"
          >
            <FaDownload className="text-xs" /> Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {currentData.summary.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${s.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                {s.trend === "up" ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
                {s.delta}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">vs last period</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Revenue Over Time</h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">In thousands (Rs. K)</span>
        </div>
        <RevenueChart data={currentData.revenue} labels={currentData.labels} />
      </div>

      {/* Category + status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-5">Sales by Category</h2>
          <CategoryBarChart data={currentData.categories} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-5">Order Status Breakdown</h2>
          <DonutChart data={currentData.status} />
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Top Performing Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="px-5 py-3 font-bold">Item</th>
                <th className="px-5 py-3 font-bold">Units Sold</th>
                <th className="px-5 py-3 font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {currentData.topProducts.map((p) => (
                <tr key={p.name} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">{p.name}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.sold.toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}