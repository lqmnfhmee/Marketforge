import { TrendingUp, TrendingDown, Edit2, X, Check } from "lucide-react";
import { useState } from "react";

import { useWallet } from "../context/WalletContext";

function NetWorthCard() {
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
    <div
      className="
        bg-[#1e293b]
        rounded-3xl
        p-8
        text-white
      "
    >
      <div className="flex items-center gap-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              className="bg-[#0f172a] text-3xl font-bold text-white px-4 py-2 rounded-xl outline-none w-48 border border-[#334155] focus:border-blue-500 transition-colors"
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
              className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              title="Confirm"
            >
              <Check size={20} />
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
              title="Cancel"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 group">
            <h1 className="text-5xl font-bold">
              {silverBalance.toLocaleString()}
            </h1>
            <button
              onClick={() => {
                setEditAmount(silverBalance.toString());
                setIsEditing(true);
              }}
              className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 rounded-lg hover:bg-slate-600"
              title="Update Balance"
            >
              <Edit2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        className={`
          flex
          items-center
          gap-2
          mt-4
          ${isPositive ? "text-green-400" : "text-red-400"}
        `}
      >
        {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}

        <span className="text-lg">
          {isPositive ? "+" : ""}{weeklyChange.toLocaleString()} this week
        </span>
      </div>
    </div>
  );
}

export default NetWorthCard;