import Sidebar from "../config/Sidebar";
import GoldCard from "../components/dashboard/GoldCart";
import WeeklyProfitChart from "../components/dashboard/WeeklyProfitChart";
import NotesCard from "../components/dashboard/NotesCard";
import TransactionsCard from "../components/dashboard/TransactionCard";
import PocketCard from "../components/dashboard/PocketCard";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useWallet } from "../components/context/WalletContext";
import { usePockets } from "../components/context/PocketContext";
import { TrendingUp, TrendingDown, Edit2, X, Check, CircleDollarSign } from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------
   Inline hero — Total Net Worth centered, Gold badge top-right
------------------------------------------------------------------ */
function HeroHeader() {
  const { silverBalance, getWeeklyChange, addTransaction } = useWallet();
  const weeklyChange = getWeeklyChange();
  const isPositive = weeklyChange >= 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");

  const handleUpdateBalance = async () => {
    if (!editAmount && editAmount !== "0") {
      setIsEditing(false);
      return;
    }
    const newBalance = Number(editAmount);
    const difference = newBalance - silverBalance;
    if (difference !== 0) {
      await addTransaction({
        type: difference > 0 ? "income" : "expense",
        category: "Balance Adjustment",
        amount: Math.abs(difference),
        note: "Manual balance update",
      });
    }
    setIsEditing(false);
    setEditAmount("");
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-6 pb-6 px-4 sm:px-8">
      {/* Gold badge — sits inline on mobile, top-right on desktop */}
      <div className="self-end mb-4 sm:mb-0 sm:absolute sm:top-12 sm:right-12 z-20 flex justify-end">
        <GoldCard />
      </div>

      <div className="bg-[#111827] rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#1a1f2e] shadow-[0_8px_30px_rgb(0,0,0,0.4)] group transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,215,0,0.05)] hover:border-[rgba(255,215,0,0.08)]">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] to-[#0b0f19] opacity-80 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-slate-400/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-slate-300/10 transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-[#9ca3af] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 font-[Inter] flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#4b5563] hidden sm:block"></span>
            Total Net Worth
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#4b5563] hidden sm:block"></span>
          </p>

          {/* Balance — editable */}
          {isEditing ? (
            <div className="flex flex-wrap items-center gap-3 mb-6 justify-center sm:justify-start">
              <input
                type="text"
                autoFocus
                className="bg-[#0b0f19] text-3xl sm:text-5xl font-bold text-white px-4 sm:px-6 py-3 rounded-2xl outline-none w-full max-w-xs sm:w-80 border border-[#1a1f2e] focus:border-slate-500 transition-colors text-center sm:text-left shadow-inner"
                style={{ fontFamily: "'Cinzel', serif" }}
                placeholder="New balance"
                value={
                  editAmount === "" || editAmount === undefined
                    ? ""
                    : Number(editAmount).toLocaleString()
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(rawValue)) {
                    setEditAmount(rawValue ? Number(rawValue) : "");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateBalance();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              />
              <button
                onClick={handleUpdateBalance}
                className="p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600 transition hover:scale-105"
                title="Confirm"
              >
                <Check size={22} className="text-white" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-4 bg-red-900/30 border border-red-900/50 rounded-xl hover:bg-red-900/50 transition hover:scale-105"
                title="Cancel"
              >
                <X size={22} className="text-red-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 group/edit mb-6 relative">
              <div className="relative hidden sm:block">
                <div className="absolute inset-0 bg-slate-300 blur-xl opacity-20 rounded-full scale-150 group-hover:opacity-30 transition-opacity"></div>
                <CircleDollarSign size={56} className="text-slate-300 relative z-10 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <CircleDollarSign size={48} className="text-slate-300 sm:hidden mb-1 relative z-10 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)]" strokeWidth={1.5} />
                <h1 
                  className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {silverBalance.toLocaleString()}
                </h1>
              </div>
              <button
                onClick={() => {
                  setEditAmount(silverBalance.toString());
                  setIsEditing(true);
                }}
                className="p-2.5 sm:ml-4 opacity-0 group-hover/edit:opacity-100 transition-all duration-300 bg-[#1a1f2e] border border-white/5 rounded-xl hover:bg-[#1f2937] hover:border-white/10 hover:scale-110 shadow-lg absolute -right-12 sm:static top-2"
                title="Edit Balance"
              >
                <Edit2 size={20} className="text-slate-300" />
              </button>
            </div>
          )}

          {/* Weekly profit */}
          <div
            className={`inline-flex items-center gap-2 text-sm sm:text-base font-semibold px-4 py-2 rounded-full border bg-black/20 backdrop-blur-sm transition-colors duration-300 ${
              isPositive 
                ? "text-[#10b981] border-[#10b981]/20 group-hover:border-[#10b981]/40 group-hover:bg-[#10b981]/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                : "text-[#9f1239] border-[#9f1239]/20 group-hover:border-[#9f1239]/40 group-hover:bg-[#9f1239]/10 shadow-[0_0_15px_rgba(159,18,57,0.05)]"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>
              {isPositive ? "+" : ""}
              {weeklyChange.toLocaleString()} this week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Dashboard
------------------------------------------------------------------ */
function Dashboard() {
  const { loading: walletLoading } = useWallet();
  const { loading: pocketLoading } = usePockets();
  const isLoading = walletLoading || pocketLoading;

  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="flex bg-[#0f172a] min-h-screen">
        <Sidebar />

        {/* Push content down on mobile to clear the fixed top bar */}
        <div className="flex-1 flex flex-col pt-14 lg:pt-0 pb-16 lg:pb-0">
          {/* ── Hero ── */}
          {isLoading ? (
            <div className="relative flex flex-col items-center pt-10 pb-8 px-4 sm:px-8 gap-4">
              <Skeleton height={20} width={140} borderRadius={8} />
              <Skeleton height={72} width="80%" borderRadius={16} />
              <Skeleton height={28} width={240} borderRadius={8} />
            </div>
          ) : (
            <div className="relative">
              <HeroHeader />
            </div>
          )}

          {/* ── Responsive grid: 1 col mobile → 2 col desktop ── */}
          <div className="px-4 sm:px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

              {isLoading ? (
                <>
                  {/* left column */}
                  <div className="flex flex-col gap-6">
                    <Skeleton height={420} borderRadius={24} />
                    <Skeleton height={240} borderRadius={24} />
                  </div>
                  {/* right column */}
                  <div className="flex flex-col gap-6">
                    <Skeleton height={300} borderRadius={24} />
                    <Skeleton height={220} borderRadius={24} />
                  </div>
                </>
              ) : (
                <>
                  {/* Left column — chart + transactions */}
                  <div className="flex flex-col gap-6">
                    <WeeklyProfitChart />
                    <TransactionsCard />
                  </div>

                  {/* Right column — notes + pockets */}
                  <div className="flex flex-col gap-6">
                    <NotesCard />
                    <PocketCard />
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default Dashboard;