import PocketPerformanceChart from "../components/pockets/PocketPerformanceChart";
import { useParams } from "react-router-dom";
import { Plus, ArrowDown, Settings } from "lucide-react";
import Sidebar from "../config/Sidebar";
import { usePockets } from "../components/context/PocketContext";
import { useState } from "react";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PocketDetailsPage() {
    const { id } = useParams();
    const { pockets, loading, depositToPocket, withdrawFromPocket } = usePockets();
    const pocket = pockets.find((p) => p.id === Number(id));

    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        const value = Number(amount);
        if (!value || value <= 0) {
            toast.error("Invalid amount");
            return;
        }

        setSubmitting(true);
        const loadingToast = toast.loading("Processing...");

        if (mode === "deposit") {
            await depositToPocket(pocket.id, value);
            toast.dismiss(loadingToast);
            toast.success("Silver added to pocket");
        }

        if (mode === "withdraw") {
            if (value > pocket.balance) {
                toast.dismiss(loadingToast);
                toast.error("Not enough silver");
                setSubmitting(false);
                return;
            }
            await withdrawFromPocket(pocket.id, value);
            toast.dismiss(loadingToast);
            toast.success("Silver withdrawn successfully");
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
                        <button className="bg-[#111827] border border-[#1a1f2e] hover:border-[#fbbf24]/50 rounded-3xl p-5 sm:p-8 text-slate-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.1)] transition-all duration-300 group">
                            <Settings size={32} className="mx-auto group-hover:text-slate-400 transition-colors" />
                            <h2 className="text-sm sm:text-xl font-bold mt-3 sm:mt-4" style={{ fontFamily: "'Cinzel', serif" }}>Settings</h2>
                        </button>
                    </div>

                    {/* Deposit / Withdraw Modal */}
                    {mode && (
                        <div className="form-panel mt-8">
                            <div className="relative z-10 max-w-xl mx-auto">
                                <h2 className="text-2xl sm:text-3xl text-white font-bold text-center tracking-wide mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {mode === "deposit" ? "Deposit Silver" : "Withdraw Silver"}
                                </h2>
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
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="btn-primary w-full mt-6"
                                >
                                    {submitting ? "Processing..." : "Confirm Transaction"}
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