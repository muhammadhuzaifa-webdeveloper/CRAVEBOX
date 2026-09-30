import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { FaTimes, FaStar, FaExternalLinkAlt, FaGithub, FaCode, FaCheckCircle, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { api } from "../api/client";

import { CartContext } from "../context/CartProvider";

const drinks = [
  { id: 101, name: "Coca Cola" },
  { id: 102, name: "Pepsi" },
  { id: 103, name: "Sprite" },
  { id: 104, name: "Orange Juice" },
  { id: 105, name: "Water" },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedDrink, setSelectedDrink] = useState(drinks[0]);

  // Cart Context access
  const { addToCart } = useContext(CartContext) || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Close / Back Navigation Handler
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/collection");
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm">Loading...</div>;
  }

  // If Product / Project Not Found
  if (!product) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl"
        >
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            404
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            Project / Dish Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            The item you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Back to Collection
          </button>
        </motion.div>
      </div>
    );
  }

  // Dynamic Data fallbacks
  const techStack = product.techStack || product.technologies || ["React", "Tailwind CSS", "Node.js", "Context API"];
  const features = product.features || [
    "Fully Responsive and Modern Interface",
    "Real-time state synchronization",
    "Optimized performance and fast load times",
  ];
  
  const githubUrl = product.githubUrl || product.codeUrl || "#";
  const projectStatus = product.status || "Completed";

  // Live Demo Button Handler: Open detail page path in a new tab
  const handleLiveDemo = () => {
    // Agar aapka detail page ka route '/product/:id' hai toh yeh path banega
    const detailPagePath = `/product/${product.id}`;
    const fullUrl = `${window.location.origin}${detailPagePath}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity, selectedDrink);
    } else {
      console.warn("addToCart function is not available in Context.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative">
        
        {/* Floating Close / Cross Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          aria-label="Close details"
          className="absolute -top-3 right-0 sm:right-2 z-20 p-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors cursor-pointer"
        >
          <FaTimes size={18} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl mt-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Image Gallery & Badges */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square border border-slate-200 dark:border-slate-800 group">
                <img
                  src={product.image || product.img}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                {product.category && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black tracking-wider px-3 py-1.5 rounded-full uppercase shadow-md">
                    {product.category}
                  </span>
                )}

                {/* Status Badge */}
                <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {projectStatus}
                </span>
              </div>

              {/* Action Buttons: Live Demo & GitHub */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleLiveDemo}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <FaExternalLinkAlt size={13} />
                  <span>Live Demo</span>
                </button>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                >
                  <FaGithub size={16} />
                  <span>Source</span>
                </a>
              </div>
            </div>

            {/* Right Column: Project Details Information */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Header Title & Rating */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                      {product.title || product.name}
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                      ID: #{product.id}
                    </p>
                  </div>

                  {product.rating && (
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 shrink-0">
                      <FaStar className="text-amber-500" /> {product.rating}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                {product.price && (
                  <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                    Rs. {Number(product.price).toLocaleString()}
                  </div>
                )}

                {/* Short & Full Description */}
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {product.description || product.shortDescription || "High-quality item designed with attention to detail and user experience."}
                </p>

                {/* Technologies / Skills Used */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FaCode /> Technologies & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order / Add to Cart Interactive Section */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Drink Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Side Option
                    </label>
                    <select
                      value={selectedDrink.id}
                      onChange={(e) => {
                        const drink = drinks.find((d) => d.id === parseInt(e.target.value));
                        if (drink) setSelectedDrink(drink);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      {drinks.map((drink) => (
                        <option key={drink.id} value={drink.id}>
                          {drink.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Counter */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Quantity
                    </label>
                    <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl p-1">
                      <button
                        disabled={quantity === 1}
                        onClick={() => setQuantity(quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </motion.button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;