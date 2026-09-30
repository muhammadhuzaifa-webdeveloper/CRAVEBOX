// Checkbox.jsx
export function Checkbox({ category, selectedCategories, onChangeCategory }) {
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