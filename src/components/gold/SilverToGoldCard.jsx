function SilverToGoldCard() {
  return (
    <div className="form-panel h-full">
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-2 text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
          Silver → Gold
        </h2>

        <p className="text-slate-400 mb-6 text-sm uppercase tracking-widest font-[Inter]">
          Convert silver into estimated gold
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Gold Price</label>
            <input
              type="text"
              placeholder="0"
              className="input-fantasy font-bold"
              style={{ fontFamily: "'Cinzel', serif" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Silver To Spend</label>
            <input
              type="text"
              placeholder="0"
              className="input-fantasy font-bold"
              style={{ fontFamily: "'Cinzel', serif" }}
            />
          </div>
        </div>

        <button className="btn-primary w-full mt-6">
          Calculate
        </button>
      </div>
    </div>
  );
}

export default SilverToGoldCard;