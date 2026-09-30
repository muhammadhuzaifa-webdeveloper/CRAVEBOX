import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaArrowRight, FaBolt, FaLeaf, FaAward, FaGem } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const featuredCategories = [
    { name: "Burger", icon: "🍔", desc: "Juicy & Cheesy" },
    { name: "Pizza", icon: "🍕", desc: "Fresh & Crispy" },
    { name: "Shawarma", icon: "🌯", desc: "Spiced & Tender" },
    { name: "Desserts", icon: "🍰", desc: "Sweet & Delicious" },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0%,transparent_70%)]" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10"
        >
          <span className="inline-block text-orange-400 font-bold tracking-[0.25em] text-xs uppercase bg-orange-500/20 border border-orange-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
            Unrivaled Culinary Excellence
          </span>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none uppercase">
            Only Taste Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Real For Food
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Experience handcrafted gourmet delicacies made with passion, premium ingredients, and authentic recipes passed down through master chefs.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/collection")}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-[0_10px_25px_rgba(234,88,12,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <FaUtensils />
              <span>View Our Menu</span>
            </button>
            <button
              onClick={() => navigate("/collection")}
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>Explore Collection</span>
              <FaArrowRight />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Quick Category Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => navigate("/collection")}
              className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl group cursor-pointer hover:border-orange-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-xl"
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Feature Details Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">
              Our Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Crafted to Perfection For The True Food Enthusiast
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300">
              <span className="text-3xl block mb-3">✨</span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Enjoy Our Food</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Freshly prepped artisan burgers, wood-fired crispy pizzas, and authentic traditional shawarmas.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300">
              <span className="text-3xl block mb-3">🍲</span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">All Varieties</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Diverse selection of gourmet dishes paired with ice-cold beverages.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300">
              <span className="text-3xl block mb-3">👑</span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">New Flavors</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Every recipe is enriched with signature spice blends to deliver an unforgettable taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Special Feature Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Our Special Features</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-3 hover:border-orange-500/50 transition-all duration-300 shadow-sm">
            <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <FaBolt />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Fast Delivery</h3>
            <p className="text-slate-400 text-xs">Piping hot food delivered straight to your door in record time.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-3 hover:border-orange-500/50 transition-all duration-300 shadow-sm">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <FaLeaf />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">100% Fresh Food</h3>
            <p className="text-slate-400 text-xs">Sourced directly from certified fresh organic farms daily.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-3 hover:border-orange-500/50 transition-all duration-300 shadow-sm">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <FaAward />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Master Chefs</h3>
            <p className="text-slate-400 text-xs">Prepared by world-class culinary experts with perfection.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-3 hover:border-orange-500/50 transition-all duration-300 shadow-sm">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              <FaGem />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Luxury Quality</h3>
            <p className="text-slate-400 text-xs">Unmatched food taste and top-tier presentation guaranteed.</p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call To Action Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Ready to Taste the Difference?
            </h2>
            <p className="text-orange-100 text-xs sm:text-sm max-w-lg">
              Explore our full collection now and treat yourself to the ultimate dining experience.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/collection")}
            className="z-10 bg-slate-950 hover:bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer uppercase text-xs tracking-widest shrink-0"
          >
            Order Now
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;