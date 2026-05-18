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
  };  return (
    <div className="relative w-full mx-auto pt-12 pb-14 px-4 flex flex-col items-center justify-center">

      <div className="relative z-10 flex flex-col items-center text-center group w-full">
        <p className="text-slate-400 text-sm font-bold tracking-[0.25em] uppercase mb-4 font-[Inter]">
          Total Net Worth
        </p>

        {/* Balance — editable */}
          {isEditing ? (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <input
                type="text"
                autoFocus
                className="input-fantasy text-4xl sm:text-6xl font-bold text-white px-4 sm:px-6 py-3 text-center bg-black/20"
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
            <div className="flex items-center justify-center gap-4 group/edit mb-4 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-slate-300 blur-2xl opacity-10 rounded-full scale-150 group-hover:opacity-20 transition-opacity"></div>
                <CircleDollarSign size={56} className="text-slate-300 relative z-10 drop-shadow-md" strokeWidth={1.5} />
              </div>
              <h1 
                className="text-6xl sm:text-[5rem] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-lg leading-none"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {silverBalance.toLocaleString()}
              </h1>
              
              <div className="self-start mt-1 sm:mt-2 -ml-2">
                <GoldCard />
              </div>
              <button
                onClick={() => {
                  setEditAmount(silverBalance.toString());
                  setIsEditing(true);
                }}
                className="p-2.5 ml-4 opacity-0 group-hover/edit:opacity-100 transition-all duration-300 bg-black/40 border border-white/10 rounded-xl hover:bg-black/60 hover:border-white/20 hover:scale-110 shadow-lg absolute -right-16 top-1/2 -translate-y-1/2"
                title="Edit Balance"
              >
                <Edit2 size={20} className="text-slate-300" />
              </button>
            </div>
          )}

          {/* Weekly profit */}
          <div
            className={`inline-flex items-center gap-2 text-base font-bold transition-colors duration-300 ${
              isPositive 
                ? "text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                : "text-[#9f1239] drop-shadow-[0_0_8px_rgba(159,18,57,0.3)]"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span>
              {isPositive ? "+" : ""}
              {weeklyChange.toLocaleString()} this week
            </span>
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
    <SkeletonTheme baseColor="#0f172a" highlightColor="#1e293b">
      <div className="flex min-h-screen bg-transparent">
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