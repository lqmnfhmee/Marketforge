import { useWallet } from "../context/WalletContext";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmt(n) {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}m`;
  if (a >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center px-3 py-2.5 rounded-xl bg-[#0b0f19]/60 border border-[#1a1f2e] min-w-0 flex-1 text-center">
      <span className={`text-base font-bold leading-tight ${color}`} style={{ fontFamily: "'Cinzel', serif" }}>
        {value}
      </span>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 font-medium">
        {label}
      </span>
    </div>
  );
}

function WeeklyEconomySummary() {
  const { transactions } = useWallet();

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const weekly = transactions.filter((t) => {
    const ts = new Date(t.created_at || t.timestamp).getTime();
    const cutoff = new Date().getTime() - sevenDaysMs;
    return (
      ts >= cutoff &&
      t.category !== "Balance Adjustment" &&
      t.category !== "Pocket Transfer"
    );
  });

  const totalTx = weekly.length;

  const incomeEntries = weekly.filter((t) => t.type === "income");
  const expenseEntries = weekly.filter((t) => t.type === "expense");

  const weeklyIncome = incomeEntries.reduce((s, t) => s + Number(t.amount), 0);
  const weeklyExpenses = expenseEntries.reduce((s, t) => s + Number(t.amount), 0);
  const weeklyProfit = weeklyIncome - weeklyExpenses;

  const isPositive = weeklyProfit > 0;
  const isBreakEven = weeklyProfit === 0;

  const profitColor = isBreakEven
    ? "text-slate-400"
    : isPositive
    ? "text-emerald-400"
    : "text-rose-400";

  const ProfitIcon = isBreakEven ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="form-panel flex flex-col h-full group">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
            <BarChart2 size={18} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
          </div>
          <div>
            <h2
              className="text-lg font-bold text-white tracking-wide leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Weekly Summary
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
              Last 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Stat Pills */}
      <div className="relative z-10 flex gap-2 mb-4">
        <StatPill label="Transactions" value={totalTx} color="text-slate-200" />
        <StatPill label="Income" value={incomeEntries.length} color="text-emerald-400" />
        <StatPill label="Expenses" value={expenseEntries.length} color="text-rose-400" />
      </div>

      {/* Net Profit */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#0b0f19]/60 border border-[#1a1f2e]">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">
            Weekly Net Profit
          </p>
          <div className="flex items-center gap-2">
            <ProfitIcon size={16} className={profitColor} />
            <span
              className={`text-2xl font-bold tracking-tight ${profitColor}`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isPositive && !isBreakEven ? "+" : ""}
              {fmt(weeklyProfit)}
            </span>
          </div>
        </div>

        {/* Mini income / expense bar */}
        <div className="flex flex-col gap-1.5 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[11px] text-slate-500">Income</span>
            <span className="text-[11px] font-bold text-emerald-400" style={{ fontFamily: "'Cinzel', serif" }}>
              +{fmt(weeklyIncome)}
            </span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[11px] text-slate-500">Expenses</span>
            <span className="text-[11px] font-bold text-rose-400" style={{ fontFamily: "'Cinzel', serif" }}>
              -{fmt(weeklyExpenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyEconomySummary;
