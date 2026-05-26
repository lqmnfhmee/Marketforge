function ProfitSummary({ farmingCost, craftingCost, totalExpenses }) {
    return (
        <div className="form-panel flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.25)] to-transparent" />

            <div className="relative z-10">
                <p
                    className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Cost Summary
                </p>
                <p className="text-slate-600 text-[10px] mb-6">
                    This session's total operational expenses.
                </p>

                {/* Total expenses hero */}
                <div className="text-center mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
                        Total Expenses
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl font-bold tracking-wide text-white"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {totalExpenses.toLocaleString()}
                    </h1>
                    <p className="text-[10px] text-slate-600 mt-1">silver</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 bg-[#0b0f19]/80 border border-[#1a1f2e] p-4 rounded-xl">
                    <div className="flex justify-between items-center text-slate-300">
                        <span className="text-xs uppercase tracking-widest font-bold">Farming</span>
                        <span className="font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {farmingCost.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                        <span className="text-xs uppercase tracking-widest font-bold">Crafting</span>
                        <span className="font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {craftingCost.toLocaleString()}
                        </span>
                    </div>
                    <div className="border-t border-[#1a1f2e] pt-3 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#fbbf24]">
                            Total
                        </span>
                        <span
                            className="font-bold text-[#fbbf24] text-lg"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {totalExpenses.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Profit reminder */}
                <p className="mt-5 text-center text-[10px] text-slate-600">
                    Profit is calculated after entering actual silver received in the saved session below.
                </p>
            </div>
        </div>
    );
}

export default ProfitSummary;