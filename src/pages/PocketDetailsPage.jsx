import PocketPerformanceChart from "../components/pockets/PocketPerformanceChart";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowDown, Settings, X } from "lucide-react";
import Sidebar from "../config/Sidebar";
import { usePockets } from "../components/context/PocketContext";
import { useWallet } from "../components/context/WalletContext";
import { useState } from "react";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { supabase } from "../lib/supabase";

function PocketDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pockets, loading, depositToPocket, withdrawFromPocket, updatePocket, closePocket, fetchPockets } = usePockets();
    const { silverBalance } = useWallet();
    const pocket = pockets.find((p) => p.id === Number(id));

    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [newName, setNewName] = useState("");
    const [newGoal, setNewGoal] = useState("");
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    if (loading) {
        return (
            <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
                <div className="flex bg-transparent min-h-screen">
                    <Sidebar />
                    <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">
                        <div className="max-w-6xl mx-auto space-y-6">
                            <Skeleton height={280} borderRadius={28} />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Skeleton height={140} borderRadius={24} />
                                <Skeleton height={140} borderRadius={24} />
                                <Skeleton height={140} borderRadius={24} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton height={320} borderRadius={24} />
                                <Skeleton height={320} borderRadius={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    if (!pocket) {
        return <div className="text-white p-10">Pocket not found</div>;
    }

    const openSettings = () => {
        setNewName(pocket.name || "");
        const goalVal = pocket.goal_amount !== undefined && pocket.goal_amount !== null ? pocket.goal_amount : pocket.goal;
        setNewGoal(goalVal ? Number(goalVal).toLocaleString() : "");
        setShowCloseConfirm(false);
        setMode("settings");
    };

    const handleRename = async () => {
        if (!newName.trim() || newName.trim() === pocket.name) return;
        setSubmitting(true);
        const loadingToast = toast.loading("Saving...");
        const { success, error } = await updatePocket(pocket.id, { name: newName.trim() });
        toast.dismiss(loadingToast);
        if (success) {
            toast.success("Pocket renamed");
        } else {
            toast.error(error || "Failed to rename");
        }
        setSubmitting(false);
    };

    const handleUpdateGoal = async () => {
        const parsedGoalAmount = Number(String(newGoal).replace(/,/g, ''));
        if (isNaN(parsedGoalAmount) || parsedGoalAmount < 0) {
            toast.error("Invalid goal amount");
            return;
        }
        setSubmitting(true);
        const loadingToast = toast.loading("Saving...");
        
        const { error } = await supabase
            .from("pockets")
            .update({
                goal_amount: parsedGoalAmount,
            })
            .eq("id", pocket.id);
            
        toast.dismiss(loadingToast);
        
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Goal updated");
            await fetchPockets();
        }
        setSubmitting(false);
    };

    const handleClosePocket = async () => {
        setSubmitting(true);
        const loadingToast = toast.loading("Closing pocket...");
        const { success, error } = await closePocket(pocket.id);
        toast.dismiss(loadingToast);
        if (success) {
            toast.success("Pocket closed");
            navigate("/pockets");
        } else {
            toast.error(error || "Failed to close pocket");
            setSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        const value = Number(amount);
        if (!value || value <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        setSubmitting(true);
        const loadingToast = toast.loading("Processing transfer...");

        if (mode === "deposit") {
            const result = await depositToPocket(pocket.id, value);
            toast.dismiss(loadingToast);
            if (result?.success) {
                toast.success(`${value.toLocaleString()} silver moved to pocket`);
            } else {
                toast.error(result?.error || "Transfer failed");
                setSubmitting(false);
                return;
            }
        }

        if (mode === "withdraw") {
            const result = await withdrawFromPocket(pocket.id, value);
            toast.dismiss(loadingToast);
            if (result?.success) {
                toast.success(`${value.toLocaleString()} silver returned to main balance`);
            } else {
                toast.error(result?.error || "Withdrawal failed");
                setSubmitting(false);
                return;
            }
        }

        setAmount("");
        setMode(null);
        setSubmitting(false);
    };

    return (
        <div className="flex bg-transparent min-h-screen">
            <Sidebar />

            <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="form-panel text-center relative mt-6">
                        <div className="relative z-10">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden mx-auto border-[3px] border-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-[#1a1f2e]">
                                {pocket.image && (
                                    <img src={pocket.image} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-bold mt-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400" style={{ fontFamily: "'Cinzel', serif" }}>
                                {pocket.name}
                            </h1>
                            <p className="text-2xl sm:text-3xl text-[#10b981] mt-2 font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                                {pocket.balance.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8">
                        <button
                            onClick={() => setMode("deposit")}
                            className="bg-[#111827] border border-[#1a1f2e] hover:border-[#fbbf24]/50 rounded-3xl p-5 sm:p-8 text-slate-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.1)] transition-all duration-300 group"
                        >
                            <Plus size={32} className="mx-auto group-hover:text-[#10b981] transition-colors" />
                            <h2 className="text-sm sm:text-xl font-bold mt-3 sm:mt-4" style={{ fontFamily: "'Cinzel', serif" }}>Deposit</h2>
                        </button>
                        <button
                            onClick={() => setMode("withdraw")}
                            className="bg-[#111827] border border-[#1a1f2e] hover:border-[#fbbf24]/50 rounded-3xl p-5 sm:p-8 text-slate-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.1)] transition-all duration-300 group"
                        >
                            <ArrowDown size={32} className="mx-auto group-hover:text-[#9f1239] transition-colors" />
                            <h2 className="text-sm sm:text-xl font-bold mt-3 sm:mt-4" style={{ fontFamily: "'Cinzel', serif" }}>Withdraw</h2>
                        </button>
                        <button 
                            onClick={openSettings}
                            className="bg-[#111827] border border-[#1a1f2e] hover:border-[#fbbf24]/50 rounded-3xl p-5 sm:p-8 text-slate-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.1)] transition-all duration-300 group"
                        >
                            <Settings size={32} className="mx-auto group-hover:text-slate-400 transition-colors" />
                            <h2 className="text-sm sm:text-xl font-bold mt-3 sm:mt-4" style={{ fontFamily: "'Cinzel', serif" }}>Settings</h2>
                        </button>
                    </div>

                    {/* Deposit / Withdraw Modal */}
                    {(mode === "deposit" || mode === "withdraw") && (
                        <div className="form-panel mt-8">
                            <div className="relative z-10 max-w-xl mx-auto">
                                <h2 className="text-2xl sm:text-3xl text-white font-bold text-center tracking-wide mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {mode === "deposit" ? "Deposit Silver" : "Withdraw Silver"}
                                </h2>

                                {/* Available balance hint */}
                                <p className="text-center text-xs text-slate-500 mb-6 font-[Inter]">
                                    {mode === "deposit" ? (
                                        <>
                                            Available in main wallet:{" "}
                                            <span className="text-emerald-400 font-bold">
                                                {silverBalance.toLocaleString()} silver
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Available in pocket:{" "}
                                            <span className="text-emerald-400 font-bold">
                                                {pocket.balance.toLocaleString()} silver
                                            </span>
                                        </>
                                    )}
                                </p>

                                <input
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={amount === '' || amount === undefined ? '' : Number(amount).toLocaleString()}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        if (/^\d*$/.test(rawValue)) {
                                            setAmount(rawValue ? Number(rawValue) : '');
                                        }
                                    }}
                                    className="input-fantasy text-center text-xl font-bold"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />

                                {/* Soft warning if amount exceeds available */}
                                {mode === "deposit" && Number(amount) > silverBalance && (
                                    <p className="text-rose-400 text-xs text-center mt-2 font-[Inter]">
                                        ⚠ Exceeds main balance ({silverBalance.toLocaleString()} silver)
                                    </p>
                                )}
                                {mode === "withdraw" && Number(amount) > pocket.balance && (
                                    <p className="text-rose-400 text-xs text-center mt-2 font-[Inter]">
                                        ⚠ Exceeds pocket balance ({pocket.balance.toLocaleString()} silver)
                                    </p>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="btn-primary w-full mt-6"
                                >
                                    {submitting ? "Processing..." : "Confirm Transfer"}
                                </button>
                                <button
                                    onClick={() => setMode(null)}
                                    className="btn-secondary w-full mt-3"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === "settings" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                            <div className="form-panel max-w-md w-full relative z-10 border border-[#fbbf24]/20 shadow-[0_0_40px_rgba(251,191,36,0.1)] p-6 sm:p-8">
                                <button 
                                    onClick={() => setMode(null)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="text-2xl sm:text-3xl text-white font-bold text-center tracking-wide mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                                    Pocket Settings
                                </h2>

                                {/* Rename Pocket */}
                                <div className="mb-6 pb-6 border-b border-[#1a1f2e]">
                                    <label className="block text-sm text-slate-400 font-bold mb-2 font-[Inter] uppercase tracking-wider">Rename Pocket</label>
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            value={newName} 
                                            onChange={(e) => setNewName(e.target.value)} 
                                            className="input-fantasy flex-1 font-bold text-lg"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                            placeholder="New Pocket Name"
                                        />
                                        <button 
                                            onClick={handleRename}
                                            disabled={submitting || !newName.trim() || newName.trim() === pocket.name}
                                            className="btn-primary py-2 px-6 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Edit Goal */}
                                <div className="mb-6 pb-6 border-b border-[#1a1f2e]">
                                    <label className="block text-sm text-slate-400 font-bold mb-2 font-[Inter] uppercase tracking-wider">Target Goal (Silver)</label>
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            value={newGoal} 
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/,/g, '');
                                                if (/^\d*$/.test(rawValue)) {
                                                    setNewGoal(rawValue ? Number(rawValue).toLocaleString() : '');
                                                }
                                            }}
                                            className="input-fantasy flex-1 font-bold text-lg"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                            placeholder="E.g. 10,000,000"
                                        />
                                        <button 
                                            onClick={handleUpdateGoal}
                                            disabled={submitting}
                                            className="btn-primary py-2 px-6 disabled:opacity-50"
                                        >
                                            {submitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                    {(pocket.goal_amount > 0 || pocket.goal > 0) && (
                                        <p className="text-xs text-[#fbbf24] mt-2 font-[Inter] font-bold">Current Goal: {(pocket.goal_amount || pocket.goal).toLocaleString()} Silver</p>
                                    )}
                                </div>

                                {/* Close Pocket */}
                                <div className="mt-8">
                                    <label className="block text-sm text-[#9f1239] font-bold mb-2 font-[Inter] uppercase tracking-wider">Danger Zone</label>
                                    {!showCloseConfirm ? (
                                        <button 
                                            onClick={() => setShowCloseConfirm(true)}
                                            className="w-full bg-[#111827] border border-[#9f1239]/30 hover:border-[#9f1239] hover:bg-[#9f1239]/10 text-[#9f1239] rounded-xl py-3 font-bold transition-all duration-300 font-[Cinzel]"
                                        >
                                            Close Pocket
                                        </button>
                                    ) : (
                                        <div className="bg-[#9f1239]/10 border border-[#9f1239]/50 rounded-xl p-4 text-center">
                                            <p className="text-slate-300 mb-4 font-[Inter] text-sm">Are you sure you want to close this pocket? This action cannot be undone.</p>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => setShowCloseConfirm(false)}
                                                    className="flex-1 bg-[#111827] border border-[#1a1f2e] text-slate-300 hover:text-white rounded-lg py-2 transition-colors font-bold font-[Cinzel]"
                                                    disabled={submitting}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleClosePocket}
                                                    disabled={submitting}
                                                    className="flex-1 bg-[#9f1239] hover:bg-[#be123c] text-white rounded-lg py-2 transition-colors font-bold font-[Cinzel] disabled:opacity-50"
                                                >
                                                    {submitting ? "Closing..." : "Confirm Close"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="mt-0">
                            <PocketPerformanceChart activity={pocket.activity} />
                        </div>
                        <div className="form-panel">
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                                    Ledger
                                </h2>
                                <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[300px] pr-2">
                                    {pocket.activity.length === 0 && (
                                        <p className="text-slate-500 italic text-sm">No activity yet</p>
                                    )}
                                    {pocket.activity.map((item, index) => (
                                        <div key={index} className="bg-[#0b0f19]/80 border border-[#1a1f2e] rounded-2xl p-4 flex justify-between items-center hover:border-slate-700 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                    {item.type === "deposit" ? "Deposit" : "Withdraw"}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {item.created_at || item.timestamp ? new Date(item.created_at || item.timestamp).toLocaleString() : "Unknown Date"}
                                                </p>
                                            </div>
                                            <p className={`font-bold tracking-wide ${item.type === "deposit" ? "text-[#10b981]" : "text-[#9f1239]"}`} style={{ fontFamily: "'Cinzel', serif" }}>
                                                {item.type === "deposit" ? "+" : "-"}
                                                {item.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PocketDetailsPage;