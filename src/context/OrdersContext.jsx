import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

// Convert a MongoDB order into the shape the UI pages use
export const normalizeOrder = (o) => ({
  ...o,
  id: o.orderNumber,
  customer: o.customerName,
  item: (o.items || []).map((i) => `${i.title} (x${i.quantity})`).join(", "),
  date: o.createdAt,
  amount: `Rs. ${Number(o.total || 0).toLocaleString()}`,
});

export function OrdersProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.get(isAdmin ? "/orders" : "/orders/mine");
      setOrders(data.map(normalizeOrder));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    refresh();
    // Admin screen behaves like a live POS: pick up new online orders every 20s
    if (!isAdmin) return;
    const t = setInterval(() => {
      api.get("/orders").then((d) => setOrders(d.map(normalizeOrder))).catch(() => {});
    }, 20000);
    return () => clearInterval(t);
  }, [refresh, isAdmin]);

  const placeOrder = async (payload) => {
    const created = normalizeOrder(await api.post("/orders", payload));
    setOrders((prev) => [created, ...prev]);
    return created;
  };

  const updateOrderStatus = async (order, status) => {
    const updated = normalizeOrder(await api.patch(`/orders/${order._id}/status`, { status }));
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    return updated;
  };

  const deleteOrder = async (order) => {
    await api.delete(`/orders/${order._id}`);
    setOrders((prev) => prev.filter((o) => o._id !== order._id));
  };

  return (
    <OrdersContext.Provider
      value={{ orders: user ? orders : [], loading, error, refresh, placeOrder, updateOrderStatus, deleteOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
};
