import { useState } from "react";
import toast from "react-hot-toast";

import { useWallet } from "../context/WalletContext";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function TransactionForm() {
    const { addTransaction } = useWallet();

    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("Ingredient Purchase");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!amount) {
            toast.error("Invalid amount");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Saving transaction...");

        const result = await addTransaction({
            type,
            category,
            amount: Number(amount),
            note,
        });

        toast.dismiss(loadingToast);

        if (!result?.success) {
            toast.error("Failed to save transaction");
            setLoading(false);
            return;
        }

        toast.success("Transaction added successfully");
        setAmount("");
        setNote("");
        setLoading(false);
    };

    return (
        <div className="form-panel">
            <div className="relative z-10">
                <h2 className="text-xl font-bold text-white tracking-wide mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                    Quick Transaction
                </h2>

                {/* Type Toggle */}
                <div className="flex gap-3 mb-6 bg-[#0b0f19]/80 backdrop-blur-sm p-1.5 rounded-2xl border border-[#1a1f2e]">
                    <button
                        onClick={() => setType("expense")}
                        className={`
                            flex-1 py-2.5 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm
                            ${type === "expense"
                                ? "bg-gradient-to-b from-[#9f1239] to-[#881337] text-white shadow-[0_2px_10px_rgba(159,18,57,0.3)] border border-[#be123c]"
                                : "text-gray-500 hover:text-gray-300 border border-transparent"
                            }
                        `}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        <ArrowDownRight size={16} />
                        Expense
                    </button>

                    <button
                        onClick={() => setType("income")}
                        className={`
                            flex-1 py-2.5 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm
                            ${type === "income"
                                ? "bg-gradient-to-b from-[#10b981] to-[#047857] text-white shadow-[0_2px_10px_rgba(16,185,129,0.3)] border border-[#34d399]"
                                : "text-gray-500 hover:text-gray-300 border border-transparent"
                            }
                        `}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        <ArrowUpRight size={16} />
                        Income
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-fantasy appearance-none cursor-pointer"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                        >
                            <option>Market Sale</option>
                            <option>Ingredient Purchase</option>
                            <option>Animal Purchase</option>
                            <option>Seed Purchase</option>
                            <option>Craft Fee</option>
                            <option>Butcher Fee</option>
                            <option>Transport Cost</option>
                            <option>Player Trade</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Silver Amount</label>
                        <input
                            type="text"
                            placeholder="0"
                            value={amount === "" || amount === undefined ? "" : Number(amount).toLocaleString()}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/,/g, "");
                                if (/^\d*$/.test(rawValue)) {
                                    setAmount(rawValue ? Number(rawValue) : "");
                                }
                            }}
                            className="input-fantasy text-lg font-bold"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Optional Note</label>
                        <textarea
                            placeholder="Add details..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input-fantasy resize-none h-28 custom-scrollbar"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary w-full mt-6"
                >
                    {loading ? "Saving..." : "Add Transaction"}
                </button>
            </div>
        </div>
    );
}

export default TransactionForm;