function UpdateGoldCard() {
  return (
    <div className="form-panel h-full">
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-2 text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
          Update Gold Owned
        </h2>

        <p className="text-slate-400 mb-6 text-sm uppercase tracking-widest font-[Inter]">
          Manually set your current gold amount
        </p>

        <div className="mt-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Gold Owned</label>
            <input
              type="text"
              placeholder="0"
              className="input-fantasy font-bold"
              style={{ fontFamily: "'Cinzel', serif" }}
            />
          </div>

          <button className="btn-primary w-full">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateGoldCard;