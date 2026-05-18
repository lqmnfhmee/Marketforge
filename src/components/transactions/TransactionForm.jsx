import { useState } from "react";
import toast from "react-hot-toast";

import { useWallet } from "../context/WalletContext";

function TransactionForm() {

    const { addTransaction } =
        useWallet();

    const [type, setType] =
        useState("expense");

    const [category, setCategory] =
        useState(
            "Ingredient Purchase"
        );

    const [amount, setAmount] =
        useState("");

    const [note, setNote] =
        useState("");

    const [loading, setLoading] =
        useState(false);

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

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                        )
                    }
                    className="input-fantasy"
                >

                    <option>
                        Market Sale
                    </option>

                    <option>
                        Ingredient Purchase
                    </option>

                    <option>
                        Animal Purchase
                    </option>

                    <option>
                        Seed Purchase
                    </option>

                    <option>
                        Craft Fee
                    </option>

                    <option>
                        Butcher Fee
                    </option>

                    <option>
                        Transport Cost
                    </option>

                    <option>
                        Player Trade
                    </option>

                </select>

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