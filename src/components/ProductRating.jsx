function ProductRating({ selectedRating, onChangeRatingHandler }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold">⭐</span>
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Minimum Rating</h3>
      </div>
      <select
        className="w-full border border-slate-700 bg-slate-800 text-slate-200 rounded-xl p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all cursor-pointer"
        value={selectedRating}
        onChange={(e) => onChangeRatingHandler(Number(e.target.value))}
      >
        <option value="0">All Ratings</option>
        <option value="4.5">⭐ 4.5 & Above</option>
        <option value="4.6">⭐ 4.6 & Above</option>
        <option value="4.7">⭐ 4.7 & Above</option>
        <option value="4.8">⭐ 4.8 & Above</option>
        <option value="4.9">⭐ 4.9 & Above</option>
      </select>
    </div>
  );
}

export default ProductRating;