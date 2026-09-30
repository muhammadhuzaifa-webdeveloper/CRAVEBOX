import { useState, useContext, useMemo, useEffect } from "react";
import { FaPlus, FaTimes, FaStar, FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartProvider";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.4 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

function Collection() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext) || {};

  const { isAdmin } = useAuth();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then(setProductList)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [searchParams] = useSearchParams();
  const searchText = (searchParams.get("q") || "").trim().toLowerCase();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortType, setSortType] = useState("default");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    image: "",
    price: "",
    rating: "5",
    category: "Burger",
    description: "",
  });

  const categories = ["All", "Pizza", "Burger", "Shawarma", "Pasta", "Desserts", "Drinks"];

  const processedProducts = useMemo(() => {
    let items = [...productList];
    if (selectedCategory !== "All") {
      items = items.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchText) {
      items = items.filter((p) => `${p.title} ${p.category} ${p.description}`.toLowerCase().includes(searchText));
    }
    if (sortType === "rating-high-low") items.sort((a, b) => b.rating - a.rating);
    else if (sortType === "rating-low-high") items.sort((a, b) => a.rating - b.rating);
    else if (sortType === "price-low-high") items.sort((a, b) => a.price - b.price);
    else if (sortType === "price-high-low") items.sort((a, b) => b.price - a.price);
    return items;
  }, [productList, selectedCategory, sortType, searchText]);

  // Handle Adding New Product
  const handleAddMenuSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.description.trim()) return;
    try {
      const created = await api.post("/products", {
        title: newProduct.title,
        image: newProduct.image,
        price: Number(newProduct.price),
        rating: Number(newProduct.rating),
        category: newProduct.category,
        description: newProduct.description.trim(),
      });
      setProductList([created, ...productList]);
      setNewProduct({ title: "", image: "", price: "", rating: "5", category: "Burger", description: "" });
      setIsAddModalOpen(false);
    } catch (err) {
      setLoadError(err.message);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/products/${itemToDelete.id}`);
      setProductList(productList.filter((item) => item.id !== itemToDelete.id));
    } catch (err) {
      setLoadError(err.message);
    }
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Menu / Collection</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore our delicious menu items or add your own custom creations.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
            >
              <option value="default">Sort / Rating</option>
              <option value="rating-high-low">Rating: High to Low</option>
              <option value="rating-low-high">Rating: Low to High</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>

            {isAdmin && <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <FaPlus />
              <span>Add Item</span>
            </motion.button>}
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Grid */}
        {loading && <p className="text-center text-sm text-slate-400 py-10">Loading menu...</p>}
        {loadError && <p className="text-center text-sm text-rose-500 py-4" role="alert">{loadError}</p>}
        {!loading && !loadError && processedProducts.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">No items found in this category.</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + sortType}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2"
          >
            {processedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                variants={itemVariants}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/collection/${product.id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100 dark:bg-slate-800 aspect-square shadow-inner">
                    <img
                      src={product.image || product.img}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 line-clamp-1">
                    {product.title || product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                    <FaStar />
                    <span>{product.rating || 5}</span>
                  </div>

                  {product.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400">
                    Rs. {product.price}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (addToCart) addToCart(product);
                      }}
                      className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors duration-200"
                      title="Add to cart"
                    >
                      <FaPlus className="text-xs" />
                    </button>

                    {isAdmin && <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(product);
                      }}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors duration-200"
                      title="Delete item"
                    >
                      <FaTrash className="text-xs" />
                    </button>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Add New Item</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMenuSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter item name..."
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      placeholder="500"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                    >
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter item description..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-colors mt-2 cursor-pointer text-xs uppercase tracking-wider"
                >
                  Save Item
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl relative z-10 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner border border-rose-500/20">
                <FaTrash />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  Delete Item?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-300">"{itemToDelete.title || itemToDelete.name}"</span>?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collection;