import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartProvider";
import { FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function CartSidebar() {
  const { cartItems = [], isCartOpen, closeCart, removeCartItem } =
    useContext(CartContext) || {};

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop (Fade In / Fade Out) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer (Right-to-Left Slide Animation) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col shadow-2xl transition-colors duration-300"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">
                  Your Cart
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeCart}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <FaTimes className="text-lg" />
                </motion.button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                <AnimatePresence mode="popLayout">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <motion.div
                        key={item.id || item._id || index}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center gap-3 shadow-sm hover:shadow-md dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.title || item.name}
                          </h4>
                          {item.drink && (
                            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                              🥤 {item.drink.name || item.drink}
                            </p>
                          )}
                          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            Qty:{" "}
                            <span className="font-bold text-slate-800 dark:text-white">
                              {item.quantity || 1}
                            </span>{" "}
                            × Rs. {item.price}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-orange-600 dark:text-orange-400 text-sm">
                            Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeCartItem(item.id || item._id || item)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <FaTrash className="text-xs" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                    >
                      <motion.span
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="text-5xl"
                      >
                        🛒
                      </motion.span>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        Your cart is empty!
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/collection"
                          onClick={closeCart}
                          className="inline-block bg-cyan-500 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-cyan-600 dark:hover:bg-cyan-300 transition shadow-md shadow-cyan-500/20"
                        >
                          Browse Menu
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Subtotal & Action */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md space-y-4 transition-colors">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                      Total:
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-black text-xl">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="block text-center w-full bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 uppercase tracking-wider text-xs"
                    >
                      Go to Checkout
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;