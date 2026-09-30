import { FaTimes, FaPrint, FaTrash } from "react-icons/fa";
import { printReceipt } from "../utils/receipt";

const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

export default function OrderReceiptModal({ order, onClose, onDelete }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-black text-slate-900 dark:text-white">{order.orderNumber}</h2>
            <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Customer" value={order.customerName} />
            <Info label="Phone" value={order.phone || "-"} />
            <Info label="Type" value={order.orderType} />
            <Info label="Payment" value={order.paymentMethod} />
            <Info label="Status" value={order.status} />
            <Info label="Source" value={order.source === "pos" ? "POS counter" : "Online"} />
          </div>
          {order.address && <Info label="Address" value={order.address} />}

          <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-3 space-y-1.5">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{i.title} <span className="text-slate-400">x{i.quantity}</span></span>
                <span className="font-semibold">{money(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-3 space-y-1 text-slate-600 dark:text-slate-400">
            <Row label="Subtotal" value={money(order.subtotal)} />
            <Row label="Delivery" value={money(order.deliveryFee)} />
            {order.discount > 0 && <Row label="Discount" value={`- ${money(order.discount)}`} />}
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1">
              <span>Total</span><span>{money(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-slate-200 dark:border-slate-800">
          <button onClick={() => printReceipt(order)} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 rounded-xl transition cursor-pointer">
            <FaPrint /> Print Receipt
          </button>
          {onDelete && (
            <button onClick={() => onDelete(order)} className="px-4 flex items-center gap-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-semibold text-sm rounded-xl transition cursor-pointer" aria-label="Delete order">
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">{label}</p>
    <p className="text-slate-800 dark:text-slate-200 font-semibold">{value}</p>
  </div>
);
const Row = ({ label, value }) => (
  <div className="flex justify-between"><span>{label}</span><span>{value}</span></div>
);
