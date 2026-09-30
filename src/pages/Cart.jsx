import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaShoppingBag, FaArrowRight, FaPlus, FaMinus } from "react-icons/fa";
import { CartContext } from "../context/CartProvider";
import CheckoutModal from "../components/CheckoutModal";

function Cart() {
  const { cartItems = [], removeCartItem, updateQuantity, totalPrice = 0, clearCart } = useContext(CartContext) || {};
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!user) {
      navigate("/login", {
        state: { from: "/cart", role: "client", notice: "Please log in or create an account to place your order." },
      });
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Fallback calculation in case context doesn't provide totalPrice directly
  const calculatedTotal = totalPrice || cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-slate-800 dark:text-slate-100 transition-colors duration-300"
    >
      <div className="flex items-center gap-3.5 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-2xl text-cyan-600 dark:text-cyan-400">
          <FaShoppingBag className="text-2xl sm:text-3xl" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review your items and proceed to secure checkout.
          </p>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          <ul className="space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const itemId = item.id || item._id || index;

                return (
                  <motion.li
                    key={itemId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    layout
                    className="p-4 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 gap-4 sm:gap-6 transition-all duration-300"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white truncate">
                        {item.title || item.name}
                      </h3>
                      
                      {/* Optional Selected Drink or Extra Instructions Badge */}
                      {(item.drink || item.instructions) && (
                        <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.drink && (
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                              🥤 {item.drink.name}
                            </span>
                          )}
                          {item.instructions && (
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg italic truncate max-w-xs">
                              Note: "{item.instructions}"
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-orange-600 dark:text-orange-400 font-black text-base sm:text-lg pt-1">
                        Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity ? updateQuantity(index, -1) : null}
                          disabled={(item.quantity || 1) <= 1}
                          className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
                        >
                          <FaMinus className="text-xs" />
                        </motion.button>
                        
                        <span className="px-3.5 font-black text-sm text-slate-800 dark:text-slate-200">
                          {item.quantity || 1}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity ? updateQuantity(index, 1) : null}
                          className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <FaPlus className="text-xs" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeCartItem(index)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5"
                        title="Remove Item"
                      >
                        <FaTrash className="text-xs" />
                        <span className="hidden sm:inline">Remove</span>
                      </motion.button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* Total & Checkout Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl transition-colors duration-300">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider font-bold">
                Total Amount
              </p>
              <p className="text-2xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                Rs. {calculatedTotal.toLocaleString()}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceed}
              className="w-full sm:w-auto bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black px-8 py-4 rounded-xl transition shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/10 cursor-pointer flex items-center justify-center gap-2.5 uppercase text-xs tracking-wider"
            >
              <span>Proceed to Checkout</span>
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-sm transition-colors"
        >
          <div className="w-20 h-20 bg-cyan-50 dark:bg-cyan-500/10 rounded-full flex items-center justify-center text-3xl text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20 shadow-inner">
            🛒
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Your Plate is Empty!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Looks like you haven't added any delicious meals to your cart yet.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-2">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-bold px-6 py-3.5 rounded-xl transition text-xs uppercase tracking-wider shadow-md"
            >
              Explore Menu & Collection
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalPrice={calculatedTotal}
        clearCart={clearCart}
      />
    </motion.div>
  );
}

export default Cart;