import { useWallet } from "../context/WalletContext";
import { ScrollText, ArrowUpRight, ArrowDownRight } from "lucide-react";

function TransactionsCard() {
  const { transactions } = useWallet();

  // Show last 5 transactions (most recent first)
  const recent = [...transactions].slice(0, 5);

  return (
    <div className="form-panel flex flex-col h-full group">
      {/* Background handled by form-panel */}      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
            <ScrollText size={20} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            Recent Ledgers
          </h2>
        </div>
      </div>

      <div className="relative z-10 flex-1 space-y-3">
        {recent.length === 0 && (
          <p className="text-slate-500 text-sm italic py-4 text-center">No transactions recorded yet.</p>
        )}
        {recent.map((item, index) => {
          const isIncome = item.type === "income";
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-[#0b0f19]/80 backdrop-blur-sm p-4 rounded-2xl border border-[#1a1f2e] hover:border-slate-700 transition-colors group/item"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isIncome ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#9f1239]/10 text-[#9f1239]'}`}>
                  {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">
                  {item.note || item.category || "Transaction"}
                </span>
              </div>

              <span
                className={`font-bold tracking-wide ${
                  isIncome ? "text-[#10b981]" : "text-[#9f1239]"
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isIncome ? "+" : "-"}
                {Number(item.amount).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionsCard;