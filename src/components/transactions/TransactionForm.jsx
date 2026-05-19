import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

import { useWallet } from "../context/WalletContext";

const CATEGORIES = [
    "Guild Trade",
    "Market Trade",
    "Player Trade",
    "Farming Expenses",
    "Crafting Expenses",
    "Ingredients Expenses",
    "In Game Rewards",
    "Fame Booster"
];

function TransactionForm() {

    const { addTransaction } =
        useWallet();

    const [type, setType] =
        useState("expense");

    const [category, setCategory] =
        useState(
            "Market Trade"
        );

    const [amount, setAmount] =
        useState("");

    const [note, setNote] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit =
        async () => {

            if (!amount) {
                toast.error("Invalid amount");
                return;
            }

            setLoading(true);
            const loadingToast = toast.loading("Saving transaction...");

            const result =
                await addTransaction({
                    type,
                    category,
                    amount:
                        Number(amount),
                    note,
                });

            toast.dismiss(loadingToast);

            if (!result?.success) {

                toast.error(
                    "Failed to save transaction"
                );

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

            <h2 className="text-2xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                Quick Transaction
            </h2>

            {/* Type Toggle */}
            <div className="flex gap-3 mt-6">

                <button
                    onClick={() =>
                        setType("expense")
                    }
                    className={`
                        flex-1
                        py-3
                        rounded-xl
                        transition-all
                        font-medium

                        ${type === "expense"
                            ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                            : "bg-black/20 text-slate-400 border border-transparent hover:bg-black/40"
                        }
                    `}
                >
                    Expense
                </button>

                <button
                    onClick={() =>
                        setType("income")
                    }
                    className={`
                        flex-1
                        py-3
                        rounded-xl
                        transition-all
                        font-medium

                        ${type === "income"
                            ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                            : "bg-black/20 text-slate-400 border border-transparent hover:bg-black/40"
                        }
                    `}
                >
                    Income
                </button>

            </div>

            {/* Form */}
            <div className="space-y-4 mt-6">

                {/* Custom Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="input-fantasy w-full text-left flex justify-between items-center"
                    >
                        <span>{category}</span>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-[#0b101c] border border-[#fbbf24]/20 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        setCategory(cat);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-4 py-3 
                                        transition-all duration-200
                                        flex items-center gap-3
                                        border-b border-white/5 last:border-0
                                        ${category === cat 
                                            ? "bg-[#fbbf24]/10 text-[#fbbf24]" 
                                            : "text-slate-300 hover:bg-[#fbbf24]/5 hover:text-[#fbbf24]"
                                        }
                                    `}
                                >
                                    {/* Icon Placeholder */}
                                    <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-colors ${category === cat ? "bg-[#fbbf24]/20" : "bg-slate-800/50"}`}>
                                        {/* Future Icon */}
                                    </div>
                                    <span className="font-medium font-[Inter]">{cat}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Amount"
                    value={
                        amount === "" ||
                            amount === undefined
                            ? ""
                            : Number(
                                amount
                            ).toLocaleString()
                    }
                    onChange={(e) => {

                        const rawValue =
                            e.target.value.replace(
                                /,/g,
                                ""
                            );

                        if (
                            /^\d*$/.test(
                                rawValue
                            )
                        ) {

                            setAmount(
                                rawValue
                                    ? Number(
                                        rawValue
                                    )
                                    : ""
                            );
                        }
                    }}
                    className="input-fantasy"
                />

                <textarea
                    placeholder="Optional note..."
                    value={note}
                    onChange={(e) =>
                        setNote(
                            e.target.value
                        )
                    }
                    className="input-fantasy resize-none h-28"
                />

            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-primary mt-6"
            >
                {loading ? "Saving..." : "Add Transaction"}
            </button>

        </div>
    );
}

export default TransactionForm;