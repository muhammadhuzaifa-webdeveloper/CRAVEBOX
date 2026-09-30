import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartProvider";
import {
  FaUtensils,
  FaTachometerAlt,
  FaStore,
  FaChartLine,
  FaShoppingBag,
  FaListUl,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";

// `roles` empty = visible to everyone (including guests)
const NAV_ITEMS = [
  { label: "Dashboard", icon: FaTachometerAlt, to: "/dashboard" },
  { label: "Home", icon: FaStore, to: "/home" },
  { label: "Report", icon: FaChartLine, to: "/report", roles: ["admin"] },
  { label: "Orders", icon: FaShoppingBag, to: "/orders", roles: ["admin", "client"] },
  { label: "Menu", icon: FaListUl, to: "/collection" },
  { label: "Customers", icon: FaUsers, to: "/customers", roles: ["admin"] },
];

/**
 * Persistent app sidebar.
 * - Desktop (lg+): fixed column on the left, always visible.
 * - Mobile: slide-in drawer, toggled by the hamburger button in Topbar.
 */
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clearCart } = useCart() || {};
  const isActive = (path) => location.pathname === path;
  const items = NAV_ITEMS.filter((i) => !i.roles || i.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    clearCart?.();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FaUtensils className="text-sm" />
            </span>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Crave<span className="text-cyan-500 dark:text-cyan-400">Box</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {items.map(({ label, icon: Icon, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={label}
                to={to}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-600" />
                )}
                <Icon className="text-base" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-5 border-t border-slate-200 dark:border-slate-800 space-y-1 shrink-0">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-1">
            CraveBox
          </p>
          {user && (
            <Link to="/settings" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <FaCog className="text-base" />
              Setting
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <FaSignOutAlt className="text-base" />
              Log out
            </button>
          ) : (
            <Link to="/login" onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <FaSignInAlt className="text-base" />
              Log in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;