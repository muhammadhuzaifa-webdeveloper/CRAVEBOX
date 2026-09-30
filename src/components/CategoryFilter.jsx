// Checkbox Component
function Checkbox({ category, selectedCategories, onChangeCategory }) {
  const isChecked = selectedCategories.includes(category);
  
  return (
    <label className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border ${
      isChecked 
        ? "bg-cyan-950/60 text-cyan-400 font-bold border-cyan-500/40 shadow-sm" 
        : "hover:bg-slate-800/50 text-slate-300 border-transparent hover:border-slate-800"
    }`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-4 h-4 rounded text-cyan-500 border-slate-700 bg-slate-800 focus:ring-cyan-500 accent-cyan-500 cursor-pointer"
          checked={isChecked}
          onChange={(e) => onChangeCategory(category, e.target.checked)}
        />
        <span className="text-sm tracking-wide">{category}</span>
      </div>
      {isChecked && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>}
    </label>
  );
}

const categories = ["Burger", "Pizza", "Shawarma"];

// CategoryFilter Component
function CategoryFilter({ selectedCategories, onChangeCategoryHandler }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold">📂</span>
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Categories</h3>
      </div>
      <div className="space-y-1.5">
        {categories.map((category) => (
          <Checkbox
            key={category}
            category={category}
            selectedCategories={selectedCategories}
            onChangeCategory={onChangeCategoryHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;