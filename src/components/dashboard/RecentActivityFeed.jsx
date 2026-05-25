import { useWallet } from "../context/WalletContext";
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, Zap } from "lucide-react";

/* ─── helpers ─── */
function fmt(n) {
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}m`;
  if (a >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString();
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_CONFIG = {
  income: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
    icon: ArrowUpRight,
    prefix: "+",
  },
  expense: {
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    dot: "bg-rose-400",
    icon: ArrowDownRight,
    prefix: "-",
  },
  transfer: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
    icon: ArrowLeftRight,
    prefix: "",
  },
};

function ActivityRow({ tx, index }) {
  const isTransfer =
    tx.category === "Pocket Transfer" || tx.type === "transfer";
  const typeKey = isTransfer ? "transfer" : tx.type;
  const cfg = TYPE_CONFIG[typeKey] ?? TYPE_CONFIG.expense;
  const Icon = cfg.icon;

  const label = tx.category || tx.note || "Transaction";
  const note = tx.note && tx.note !== tx.category ? tx.note : null;

  return (
    <div
      className="group/row flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#1a1f2e] bg-[#0b0f19]/60 hover:border-slate-700/60 hover:bg-[#0d1120]/80 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Coloured icon */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.border} transition-transform duration-300 group-hover/row:scale-110`}
      >
        <Icon size={16} className={cfg.color} />
      </div>

      {/* Label + note */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-200 truncate leading-tight group-hover/row:text-white transition-colors">
          {label}
        </p>
        {note && (
          <p className="text-[11px] text-slate-500 truncate mt-0.5">{note}</p>
        )}
        <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wider">
          {tx.type}
        </p>
      </div>

      {/* Amount + time */}
      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-bold tracking-tight ${cfg.color}`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {cfg.prefix}
          {fmt(Number(tx.amount))}
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          {timeAgo(tx.created_at || tx.timestamp)}
        </p>
      </div>
    </div>
  );
}

function RecentActivityFeed() {
  const { transactions } = useWallet();

  const recent = [...transactions].slice(0, 5);

  return (
    <div className="form-panel flex flex-col h-full group">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
            <Zap size={18} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
          </div>
          <div>
            <h2
              className="text-lg font-bold text-white tracking-wide leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Recent Activity
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-0.5">
              Latest transactions
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/5 border border-emerald-400/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Live
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="relative z-10 flex-1 flex flex-col gap-2">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1a1f2e] flex items-center justify-center">
              <Zap size={18} className="text-slate-700" />
            </div>
            <p className="text-slate-500 text-sm">No activity recorded yet.</p>
          </div>
        ) : (
          recent.map((tx, i) => (
            <ActivityRow key={tx.id ?? i} tx={tx} index={i} />
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivityFeed;
