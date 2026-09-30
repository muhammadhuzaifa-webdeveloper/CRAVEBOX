import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaArrowRight, FaBolt, FaReceipt, FaUserShield, FaShoppingBag } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: FaShoppingBag, title: "Order in seconds", text: "Browse the menu, fill your cart and check out with a few taps." },
  { icon: FaBolt, title: "Live order tracking", text: "Follow every order from kitchen to doorstep, status by status." },
  { icon: FaReceipt, title: "Smart billing (POS)", text: "Staff can create counter bills, apply discounts and print receipts." },
  { icon: FaUserShield, title: "Admin & client roles", text: "Owners manage menu, orders and reports. Customers get their own space." },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <FaUtensils className="text-sm" />
          </span>
          <span className="text-xl font-black tracking-tight">
            Crave<span className="text-indigo-600 dark:text-indigo-400">Box</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">Log in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">Sign up</Link>
            </>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-24 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            Food ordering &amp; billing
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Fresh food, <span className="text-indigo-600 dark:text-indigo-400">fast</span> billing.
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            CraveBox lets customers order their favourites online while your team runs orders, bills and reports from one simple dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20">
              Open Dashboard <FaArrowRight className="text-xs" />
            </Link>
            <Link to="/collection" className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Browse Menu
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4"><Icon /></span>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CraveBox. All rights reserved.
      </footer>
    </div>
  );
}
