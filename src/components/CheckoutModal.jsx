import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { 
  FaTimes, 
  FaBicycle, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaHome, 
  FaCity, 
  FaArrowRight, 
  FaArrowLeft,
  FaPrint
} from "react-icons/fa";
import { printReceipt } from "../utils/receipt";

function CheckoutModal({ isOpen, onClose, cartItems = [], totalPrice = 0, clearCart, onOrderPlaced }) {
  // Context se addOrder function nikal liya
  const { placeOrder } = useOrders();
  const { user, isAdmin } = useAuth();
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step State: 1 = User Details Form, 2 = Receipt & Checkout, 3 = Map Tracking
  const [step, setStep] = useState(1);

  // Form State for User Info
  const [formData, setFormData] = useState({
    fullName: isAdmin ? "" : user?.name || "",
    phone: isAdmin ? "" : user?.phone || "",
    email: isAdmin ? "" : user?.email || "",
    address: "",
    city: "",
    orderType: "Delivery",
    paymentMethod: "Cash",
    discount: "",
  });

  if (!isOpen) return null;

  const isDelivery = formData.orderType === "Delivery";
  const deliveryFee = isDelivery ? 150 : 0;
  const discount = isAdmin ? Math.min(Math.max(Number(formData.discount) || 0, 0), totalPrice) : 0;
  const grandTotal = totalPrice + deliveryFee - discount;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1 -> Step 2
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleConfirmOrder = async () => {
    if (placing) return;
    setPlacing(true);
    setSubmitError("");
    try {
      const created = await placeOrder({
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: [formData.address, formData.city].filter(Boolean).join(", "),
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        discount,
        items: cartItems.map((i) => ({
          productId: i.id,
          quantity: i.quantity || 1,
          instructions: i.instructions || "",
        })),
      });
      setPlacedOrder(created);
      if (onOrderPlaced) onOrderPlaced(created);
      setStep(3);
      if (clearCart) clearCart();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handleCloseModal = () => {
    setStep(1); // Reset step back to 1 on close
    setPlacedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-colors"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-300"
        >
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 transition-colors">
            <h2 className="text-xl font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <FaBicycle className="text-2xl text-orange-500" />
              {step === 1 && (isAdmin ? "POS Billing" : "Customer Details")}
              {step === 2 && "Order Summary & Receipt"}
              {step === 3 && (isDelivery ? "Order In Transit" : "Bill Generated")}
            </h2>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseModal}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <FaTimes />
            </motion.button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* --- STEP 1: USER PERSONAL INFORMATION FORM --- */}
            {step === 1 && (
              <motion.form 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleDetailsSubmit} 
                className="space-y-4"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {isAdmin ? "Enter customer details (optional for walk-in) and choose how the bill is settled." : "Please provide your details to proceed."}
                </p>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                    <FaUser className="text-cyan-600 dark:text-cyan-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                      <FaPhoneAlt className="text-cyan-600 dark:text-cyan-400" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0300-1234567"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                      <FaEnvelope className="text-cyan-600 dark:text-cyan-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                    <FaHome className="text-cyan-600 dark:text-cyan-400" /> Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    required={isDelivery}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House #, Street, Area..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 resize-none transition-colors"
                  ></textarea>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                    <FaCity className="text-cyan-600 dark:text-cyan-400" /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required={isDelivery}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Karachi, Lahore, Islamabad etc."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Order Type</label>
                    <select
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                      {isAdmin && <option value="Dine-in">Dine-in</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Payment</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Cash">{isDelivery ? "Cash on Delivery" : "Cash"}</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Discount (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                  >
                    Proceed to Order Summary <FaArrowRight />
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* --- STEP 2: BILL GENERATION & RECEIPT --- */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                
                {/* User Details Summary Badge */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 transition-colors">
                  <div>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{formData.fullName}</span> ({formData.phone})
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-xs">{formData.orderType}{isDelivery ? ` - ${formData.address}, ${formData.city}` : ""} - {formData.paymentMethod}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-orange-600 dark:text-orange-400 hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FaArrowLeft /> Edit
                  </button>
                </div>

                {/* Generated Bill Card */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner transition-colors">
                  <h3 className="text-sm font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800 pb-2">
                    Invoice / Receipt
                  </h3>

                  {/* Items Breakdown */}
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.title || item.name} <span className="text-xs text-cyan-600 dark:text-cyan-400">x{item.quantity || 1}</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  {/* Price Calculations */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isDelivery ? "Express Bike Delivery" : formData.orderType}</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Rs. {deliveryFee}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Discount</span>
                        <span className="text-emerald-500 font-semibold">- Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-orange-600 dark:text-orange-400">Total Payable</span>
                      <span className="text-orange-600 dark:text-orange-400">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {submitError && <p className="text-sm text-rose-500 mb-3" role="alert">{submitError}</p>}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-bold py-4 rounded-xl transition text-center cursor-pointer text-sm"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmOrder}
                    disabled={placing}
                    className="w-2/3 bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black py-4 rounded-xl shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 transition text-center cursor-pointer uppercase text-xs tracking-wider"
                  >
                    {placing ? "Placing order..." : "Confirm & Dispatch Order"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* --- STEP 3: LIVE MAP & 45 MINS DELIVERY TRACKER --- */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                
                {isDelivery && (<>
                {/* Top Banner: Estimated Delivery Time */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-slate-950 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-950/20 rounded-xl flex items-center justify-center text-slate-950">
                      <FaClock className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-900/80">
                        Estimated Delivery
                      </p>
                      <h3 className="text-2xl font-black">45 Mins Delivery</h3>
                    </div>
                  </div>
                  <span className="bg-slate-950 text-amber-400 text-xs font-extrabold px-3 py-1.5 rounded-full animate-pulse">
                    On The Way 🚴
                  </span>
                </div>

                {/* Styled City Bike Tracking Map View */}
                <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center transition-colors">
                  
                  {/* Styled Map Overlay */}
                  <div className="absolute inset-0 opacity-30 dark:opacity-40 bg-[radial-gradient(#0284c7_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Simulated Roads/Paths */}
                  <svg className="absolute inset-0 w-full h-full stroke-slate-300 dark:stroke-slate-800" strokeWidth="6">
                    <path d="M 50 200 Q 200 50 350 150 T 600 80" fill="none" strokeDasharray="8 8" />
                    <path d="M 100 50 L 500 220" fill="none" className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="3" opacity="0.5" />
                  </svg>

                  {/* Restaurant Marker */}
                  <div className="absolute top-12 left-12 flex flex-col items-center">
                    <div className="w-10 h-10 bg-orange-500/20 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      🏠
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">CraveBox Kitchen</span>
                  </div>

                  {/* Destination Marker */}
                  <div className="absolute bottom-12 right-12 flex flex-col items-center">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-sm shadow-md animate-bounce bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      <FaMapMarkerAlt />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1 max-w-[100px] truncate text-center">
                      {formData.city || "Your Location"}
                    </span>
                  </div>

                  {/* Animated Bike Delivery Rider */}
                  <motion.div
                    animate={{
                      x: [-120, 100, 140],
                      y: [40, -30, -10],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className="bg-orange-500 text-slate-950 p-3 rounded-full shadow-lg shadow-orange-500/40 text-xl border-2 border-white dark:border-slate-900">
                      <FaBicycle />
                    </div>
                    <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-sm">
                      Rider Express
                    </span>
                  </motion.div>
                </div>

                </>)}

                {/* Status Message */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 transition-colors">
                  <FaCheckCircle className="text-emerald-500 dark:text-emerald-400 text-xl flex-shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {isDelivery ? (
                      <>Order <strong className="text-cyan-600 dark:text-cyan-400">{placedOrder?.orderNumber}</strong> confirmed for <strong className="text-cyan-600 dark:text-cyan-400">{formData.fullName || "customer"}</strong>! Delivery rider is on the way to <strong className="text-cyan-600 dark:text-cyan-400">{formData.address}</strong>.</>
                    ) : (
                      <>Bill <strong className="text-cyan-600 dark:text-cyan-400">{placedOrder?.orderNumber}</strong> generated for <strong className="text-cyan-600 dark:text-cyan-400">{formData.fullName || "Walk-in Customer"}</strong>. Total paid: Rs. {grandTotal.toLocaleString()} ({formData.paymentMethod}).</>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => placedOrder && printReceipt(placedOrder)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    <FaPrint /> Print Receipt
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>

              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CheckoutModal;