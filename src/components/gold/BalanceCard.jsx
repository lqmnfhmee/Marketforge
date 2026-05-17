function BalanceCard({ title, value }) {
  return (
    <div className="form-panel flex-1 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          {title}
        </h2>

        <h1 className="text-4xl font-bold mt-3 text-white tracking-wide group-hover:text-[#fbbf24] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
          {value}
        </h1>
      </div>
    </div>
  );
}

export default BalanceCard;