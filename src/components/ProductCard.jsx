import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProductCard({ product, onSelectProduct }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Agar modal trigger handler available hai toh modal open karein
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      // Direct navigation fallback (agar modal prop na ho)
      navigate(`/collection/${product.id}`);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Event bubbling rokein
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.3 }}
      className="group border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-cyan-900/20 bg-white dark:bg-slate-900 flex flex-col justify-between h-full cursor-pointer hover:border-cyan-500/50 dark:hover:border-cyan-500/40 transition-colors duration-300"
    >
      {/* Image Wrap */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 pt-[60%]">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-500/30 text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between gap-4 flex-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2">
            {product.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-normal line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Info Foot & Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-black text-lg">
              Rs. {product.price?.toLocaleString()}
            </span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              ★ {product.rating}
            </span>
          </div>

          {/* Button with motion click effect */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
            className="w-full bg-cyan-500 dark:bg-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-black py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-md shadow-cyan-500/10 dark:shadow-cyan-400/10 cursor-pointer"
          >
            View Deal
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;