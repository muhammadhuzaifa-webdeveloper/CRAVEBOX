import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Collection from "../pages/Collection";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Report from "../pages/Report";
import Settings from "../pages/Settings";







import CartSidebar from "../components/CartSidebar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { OrdersProvider } from "../context/OrdersContext";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("app_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("app_theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

// Sidebar + Topbar shell used by every screen after the landing page
function AppLayout({ theme, toggleTheme }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <OrdersProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <CartSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar theme={theme} toggleTheme={toggleTheme} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      </div>
    </OrdersProvider>
  );
}

export default function MainRouter() {
  const [theme, toggleTheme] = useTheme();

  return (
    <Routes>
      {/* 1. Landing -> 2. Dashboard -> 3. Login / Signup */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}>
        {/* Open to everyone (guests can browse and fill a cart) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Login required */}
        <Route path="/orders" element={<ProtectedRoute roles={["admin", "client"]}><Orders /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute roles={["admin", "client"]}><Settings /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/customers" element={<ProtectedRoute roles={["admin"]}><Customers /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute roles={["admin"]}><Report /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
