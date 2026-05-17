import { useState } from "react";
import toast from "react-hot-toast";

import BalanceCard from "../components/gold/BalanceCard";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Sidebar from "../config/Sidebar";
import { useWallet } from "../components/context/WalletContext";

function GoldPage() {
  const {
    silverBalance,
    goldBalance,
    loading,
    updateGoldBalance,
    buyGold,
    buySilver,
  } = useWallet();

  const [newGold, setNewGold] = useState("");
  const [goldPrice1, setGoldPrice1] = useState("");
  const [silverSpend, setSilverSpend] = useState("");
  const [goldPrice2, setGoldPrice2] = useState("");
  const [goldSell, setGoldSell] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingBuyGold, setLoadingBuyGold] = useState(false);
  const [loadingSellGold, setLoadingSellGold] = useState(false);

  const format = (num) => Number(num).toLocaleString();

  const handleUpdateGold = () => {
    if (!newGold && newGold !== 0) {
      toast.error("Please enter a gold amount");
      return;
    }
    setLoadingUpdate(true);
    const result = updateGoldBalance(Number(newGold));
    setLoadingUpdate(false);
    if (result?.success) {
      toast.success("Gold balance updated");
      setNewGold("");
    } else {
      toast.error(result?.message || "Invalid amount");
    }
  };

  const handleBuyGold = () => {
    if (!goldPrice1 || !silverSpend) {
      toast.error("Please fill in both fields");
      return;
    }
    setLoadingBuyGold(true);
    const result = buyGold({
      goldPrice: Number(goldPrice1),
      silverAmount: Number(silverSpend),
    });
    setLoadingBuyGold(false);
    if (result?.success) {
      toast.success(`Purchased ${format(result.goldReceived)} Gold`);
      setGoldPrice1("");
      setSilverSpend("");
    } else {
      toast.error(result?.message || "Purchase failed");
    }
  };

  const handleSellGold = () => {
    if (!goldPrice2 || !goldSell) {
      toast.error("Please fill in both fields");
      return;
    }
    setLoadingSellGold(true);
    const result = buySilver({
      goldPrice: Number(goldPrice2),
      goldAmount: Number(goldSell),
    });
    setLoadingSellGold(false);
    if (result?.success) {
      toast.success(`Received ${format(result.silverReceived)} Silver`);
      setGoldPrice2("");
      setGoldSell("");
    } else {
      toast.error(result?.message || "Sale failed");
    }
  };

  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="flex bg-[#0f172a] min-h-screen">
        <Sidebar />

        {/* offset for mobile nav bars */}
        <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <h1 className="text-3xl sm:text-4xl text-white font-bold">
              Gold Exchange
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your gold balance and conversions
            </p>

            {/* Balance Cards */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
                <Skeleton height={100} borderRadius={24} />
                <Skeleton height={100} borderRadius={24} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
                <BalanceCard
                  title="Gold Balance"
                  value={format(goldBalance)}
                />
                <BalanceCard
                  title="Silver Balance"
                  value={format(silverBalance)}
                />
              </div>
            )}

            {/* Main Cards — 1 col mobile, 2 col sm, 3 col lg */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <Skeleton height={220} borderRadius={24} />
                <Skeleton height={220} borderRadius={24} />
                <Skeleton height={220} borderRadius={24} />
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

              {/* Update Gold */}
              <div className="form-panel flex flex-col justify-between">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-2 text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Update Gold Owned
                  </h2>

                  <p className="text-slate-400 mb-6 text-xs uppercase tracking-widest font-[Inter]">
                    Manually update your gold
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Gold</label>
                      <input
                        type="text"
                        value={newGold === '' || newGold === undefined ? '' : Number(newGold).toLocaleString()}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(rawValue)) {
                                setNewGold(rawValue ? Number(rawValue) : '');
                            }
                        }}
                        placeholder="0"
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateGold}
                    disabled={loadingUpdate}
                    className="btn-primary w-full mt-6"
                  >
                    {loadingUpdate ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>

              {/* Silver To Gold */}
              <div className="form-panel">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-2 text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Silver → Gold
                  </h2>

                  <p className="text-slate-400 mb-6 text-xs uppercase tracking-widest font-[Inter]">
                    Purchase gold with silver
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gold Price</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={goldPrice1 === '' || goldPrice1 === undefined ? '' : Number(goldPrice1).toLocaleString()}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(rawValue)) {
                                setGoldPrice1(rawValue ? Number(rawValue) : '');
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Silver To Spend</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={silverSpend === '' || silverSpend === undefined ? '' : Number(silverSpend).toLocaleString()}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(rawValue)) {
                                setSilverSpend(rawValue ? Number(rawValue) : '');
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      />
                    </div>
                  </div>

                  {goldPrice1 && silverSpend && (
                    <p className="mt-4 text-[#34d399] font-bold tracking-widest text-sm uppercase">
                      Receive ≈{" "}
                      <span style={{ fontFamily: "'Cinzel', serif" }}>
                        {format(Math.floor(silverSpend / goldPrice1))}
                      </span>
                      {" "}Gold
                    </p>
                  )}

                  <button
                    onClick={handleBuyGold}
                    disabled={loadingBuyGold}
                    className="btn-primary w-full mt-6"
                  >
                    {loadingBuyGold ? "Processing..." : "Confirm Purchase"}
                  </button>
                </div>
              </div>

              {/* Gold To Silver */}
              <div className="form-panel sm:col-span-2 lg:col-span-1">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-2 text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Gold → Silver
                  </h2>

                  <p className="text-slate-400 mb-6 text-xs uppercase tracking-widest font-[Inter]">
                    Sell gold for silver
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gold Price</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={goldPrice2 === '' || goldPrice2 === undefined ? '' : Number(goldPrice2).toLocaleString()}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(rawValue)) {
                                setGoldPrice2(rawValue ? Number(rawValue) : '');
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gold To Sell</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={goldSell === '' || goldSell === undefined ? '' : Number(goldSell).toLocaleString()}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (/^\d*$/.test(rawValue)) {
                                setGoldSell(rawValue ? Number(rawValue) : '');
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      />
                    </div>
                  </div>

                  {goldPrice2 && goldSell && (
                    <p className="mt-4 text-[#60a5fa] font-bold tracking-widest text-sm uppercase">
                      Receive ≈{" "}
                      <span style={{ fontFamily: "'Cinzel', serif" }}>
                        {format(goldPrice2 * goldSell)}
                      </span>
                      {" "}Silver
                    </p>
                  )}

                  <button
                    onClick={handleSellGold}
                    disabled={loadingSellGold}
                    className="btn-primary w-full mt-6"
                  >
                    {loadingSellGold ? "Processing..." : "Confirm Sale"}
                  </button>
                </div>
              </div>

            </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default GoldPage;