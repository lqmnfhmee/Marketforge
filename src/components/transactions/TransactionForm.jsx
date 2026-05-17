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

        <div
            className="
                bg-[#1e293b]
                rounded-3xl
                p-6
                text-white
            "
        >

            <h2 className="text-2xl font-bold">
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
                        transition

                        ${type === "expense"
                            ? "bg-red-500 text-white"
                            : "bg-[#0f172a]"
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
                        transition

                        ${type === "income"
                            ? "bg-green-500 text-white"
                            : "bg-[#0f172a]"
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
                    className="
                        w-full
                        bg-[#0f172a]
                        p-3
                        rounded-xl
                        outline-none
                    "
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
                    className="
                        w-full
                        bg-[#0f172a]
                        p-3
                        rounded-xl
                        outline-none
                    "
                />

                <textarea
                    placeholder="Optional note..."
                    value={note}
                    onChange={(e) =>
                        setNote(
                            e.target.value
                        )
                    }
                    className="
                        w-full
                        bg-[#0f172a]
                        p-3
                        rounded-xl
                        outline-none
                        resize-none
                        h-28
                        flex -1
                        
                    "
                />

            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="
                    w-full
                    bg-blue-500
                    py-3
                    rounded-xl
                    mt-6
                    font-semibold
                    hover:scale-[1.02]
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >
                {loading ? "Saving..." : "Add Transaction"}
            </button>

        </div>
    );
}

export default TransactionForm;