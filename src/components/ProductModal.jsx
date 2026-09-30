import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const drinksList = [
  { id: 101, name: "Pepsi 1 Ltr" },
  { id: 102, name: "Coca Cola 1 Ltr" },
  { id: 103, name: "7up 1 Ltr" },
  { id: 104, name: "Sprite 1 Ltr" },
];

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedDrink, setSelectedDrink] = useState(drinksList[0]);
  const [instructions, setInstructions] = useState("");

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedDrink, instructions);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop / Dark Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes />
          </button>

          {/* Left Panel: Image Banner */}
          <div className="relative bg-slate-900 min-h-[250px] md:min-h-[450px] flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="relative z-10 text-white text-left space-y-2">
              <span className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full">
                Special Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-amber-400">
                {product.title}
              </h2>
              <p className="text-sm text-slate-200 max-w-xs leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Panel: Customization Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-white text-slate-900 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b pb-2">Customize Deal</h3>

              {/* Soft Drink Required Field */}
              <div className="space-y-2">
                <label className="text-xs font-black tracking-wide uppercase text-slate-500 flex justify-between">
                  <span>Soft Drink</span>
                  <span className="text-red-500">Required</span>
                </label>
                <select
                  value={selectedDrink.id}
                  onChange={(e) => {
                    const drink = drinksList.find((d) => d.id === parseInt(e.target.value));
                    if (drink) setSelectedDrink(drink);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {drinksList.map((drink) => (
                    <option key={drink.id} value={drink.id}>
                      {drink.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Side Item (Selected) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">Cheese Garlic Bread</span>
                <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-md">
                  Selected
                </span>
              </div>

              {/* Instructions Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Instructions
                </label>
                <textarea
                  rows="3"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Any special requests?"
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-white disabled:opacity-30 transition"
                >
                  -
                </button>
                <span className="px-3 font-extrabold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 rounded-lg hover:bg-white transition"
                >
                  +
                </button>
              </div>

              {/* Add To Cart Red Button */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex justify-between items-center shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                <span>Rs. {((product.price || 2300) * quantity).toLocaleString()}</span>
                <span>Add To Cart</span>
              </button>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProductModal;