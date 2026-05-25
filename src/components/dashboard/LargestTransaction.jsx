import { useWallet } from "../context/WalletContext";
import { Crown, ArrowUpRight, ArrowDownRight } from "lucide-react";

function fmt(n) {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}m`;
  if (a >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
}

function LargestTransaction() {
  const { transactions } = useWallet();

  // Filter out system transactions
  const real = transactions.filter(
    (t) =>
      t.category !== "Balance Adjustment" &&
      t.category !== "Pocket Transfer"
  );

  // Find largest income and largest expense
  const largestIncome = real
    .filter((t) => t.type === "income")
    .reduce((best, t) => (!best || Number(t.amount) > Number(best.amount) ? t : best), null);

  const largestExpense = real
    .filter((t) => t.type === "expense")
    .reduce((best, t) => (!best || Number(t.amount) > Number(best.amount) ? t : best), null);

  // Show whichever is bigger overall
  const champion =
    !largestIncome && !largestExpense
      ? null
      : !largestIncome
      ? largestExpense
      : !largestExpense
      ? largestIncome
      : Number(largestIncome.amount) >= Number(largestExpense.amount)
      ? largestIncome
      : largestExpense;

  const isIncome = champion?.type === "income";
  const color = isIncome ? "text-emerald-400" : "text-rose-400";
  const bg = isIncome ? "bg-emerald-400/10" : "bg-rose-400/10";
  const border = isIncome ? "border-emerald-400/20" : "border-rose-400/20";
  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
  const label = isIncome ? "Largest Income" : "Largest Expense";

  return (
    <div className="form-panel flex flex-col h-full group">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
          <Crown size={18} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
        </div>
        <div>
          <h2
            className="text-lg font-bold text-white tracking-wide leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Top Transaction
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
            All-time largest
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {!champion ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Crown size={24} className="text-slate-700" />
            <p className="text-slate-500 text-sm">No transactions yet.</p>
          </div>
        ) : (
          <div className={`flex items-center gap-4 px-4 py-4 rounded-2xl border ${border} ${bg}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} border ${border}`}>
              <Icon size={22} className={color} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
                {champion.category || "Transaction"}
              </p>
              {champion.note && champion.note !== champion.category && (
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {champion.note}
                </p>
              )}
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">
                {champion.type}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p
                className={`text-xl font-bold tracking-tight ${color}`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isIncome ? "+" : "-"}
                {fmt(Number(champion.amount))}
              </p>
            </div>
          </div>
        )}

        {/* Also show the other category if it exists */}
        {largestIncome && largestExpense && champion && (
          <div className="mt-3 flex gap-2">
            {/* Mini income */}
            <div className="flex-1 px-3 py-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 flex items-center gap-2">
              <ArrowUpRight size={13} className="text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Top income</p>
                <p className="text-xs font-bold text-emerald-400 truncate" style={{ fontFamily: "'Cinzel', serif" }}>
                  +{fmt(Number(largestIncome.amount))}
                </p>
              </div>
            </div>
            {/* Mini expense */}
            <div className="flex-1 px-3 py-2 rounded-xl border border-rose-400/10 bg-rose-400/5 flex items-center gap-2">
              <ArrowDownRight size={13} className="text-rose-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Top expense</p>
                <p className="text-xs font-bold text-rose-400 truncate" style={{ fontFamily: "'Cinzel', serif" }}>
                  -{fmt(Number(largestExpense.amount))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LargestTransaction;
