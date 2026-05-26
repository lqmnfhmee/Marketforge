function ProfitSummary(props) {
    const profitable = props.profit >= 0;
    const hasRevenue = Number(props.actualSilverReceived) > 0;

    return (
        <div className="form-panel flex flex-col justify-center text-center relative overflow-hidden">
            {/* Background glow */}
            <div
                className={`absolute inset-0 opacity-10 pointer-events-none ${
                    profitable ? "bg-[#10b981]" : "bg-[#f43f5e]"
                }`}
            />

            <div className="relative z-10">
                <p
                    className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {hasRevenue ? "Final Profit" : "Estimated Profit"}
                </p>

                {/* Profit figure */}
                <h1
                    className={`text-4xl sm:text-5xl font-bold tracking-wide ${
                        profitable
                            ? "text-[#34d399] drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "text-[#f43f5e] drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    }`}
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    {profitable ? "+" : ""}
                    {props.profit.toLocaleString()}
                </h1>

                {/* ROI */}
                <p
                    className="text-white mt-4 text-sm font-bold tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    ROI:
                    <span
                        className={`ml-2 text-lg ${profitable ? "text-[#34d399]" : "text-[#f43f5e]"}`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {props.roi}%
                    </span>
                </p>

                {/* Breakdown */}
                <div className="mt-8 space-y-3 bg-[#0b0f19]/80 border border-[#1a1f2e] p-4 rounded-xl">
                    <div className="flex justify-between items-center text-slate-300">
                        <span className="text-xs uppercase tracking-widest font-bold">
                            Total Expenses
                        </span>
                        <span className="font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {props.totalExpenses.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                        <span className="text-xs uppercase tracking-widest font-bold">
                            {hasRevenue ? "Silver Received" : "Actual Silver"}
                        </span>
                        <span
                            className={`font-bold ${hasRevenue ? "text-[#34d399]" : "text-slate-500"}`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {hasRevenue ? Number(props.actualSilverReceived).toLocaleString() : "—"}
                        </span>
                    </div>
                </div>

                {/* Status badge */}
                <div className="mt-6">
                    {profitable ? (
                        <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#34d399] py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            Profitable Production
                        </div>
                    ) : (
                        <div className="bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                            Production Loss
                        </div>
                    )}
                </div>

                {/* Helper nudge when no silver entered yet */}
                {!hasRevenue && (
                    <p className="mt-4 text-[10px] text-slate-600 text-center">
                        Enter actual silver received after selling to see real profit.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProfitSummary;