import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { FaSearch, FaBell, FaSun, FaMoon, FaShoppingBag, FaBars, FaUserCircle } from "react-icons/fa";

function Topbar({ theme, toggleTheme, onMenuClick }) {
  const { cartCount = 0, openCart } = useCart() || {};
  const { user, isAdmin } = useAuth();
  const { orders = [] } = useOrders();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  // Bell badge = orders that still need attention
  const activeCount = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/collection${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          aria-label="Open menu"
        >
          <FaBars className="text-lg" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <form onSubmit={onSearch} className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none transition"
            />
          </form>
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <FaSun className="text-lg text-yellow-400" />
            ) : (
              <FaMoon className="text-lg text-slate-700" />
            )}
          </button>

          <button
            onClick={openCart}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Quick Cart Drawer"
          >
            <FaShoppingBag className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 dark:bg-cyan-400 text-[10px] font-black text-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          {user && (
            <Link
              to="/orders"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title={isAdmin ? "Orders needing attention" : "My active orders"}
            >
              <FaBell className="text-lg" />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {activeCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">
              <FaUserCircle className="text-3xl text-slate-300 dark:text-slate-600" />
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{isAdmin ? "Admin" : "Client"}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                Log in
              </Link>
              <Link to="/signup" className="hidden sm:inline-block px-3.5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;