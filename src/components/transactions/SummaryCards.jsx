import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Receipt,
} from "lucide-react";

import { useWallet } from "../context/WalletContext";

function SummaryCards() {
    const {
        transactions,
        getSilverBalance,
        getWeeklyChange,
    } = useWallet();

    const summary = [
        {
            title: "Silver Balance",
            value: getSilverBalance().toLocaleString(),
            icon: Wallet,
            color: "text-yellow-400",
        },
        {
            title: "Weekly Profit",
            value: getWeeklyChange().toLocaleString(),
            icon: TrendingUp,
            color: "text-green-400",
        },
        {
            title: "Expenses",
            value: transactions
                .filter((t) => t.type === "expense")
                .length,
            icon: TrendingDown,
            color: "text-red-400",
        },
        {
            title: "Transactions",
            value: transactions.length,
            icon: Receipt,
            color: "text-blue-400",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8">

            {summary.map((card, index) => {
                const Icon = card.icon;

                return (
                    <div
                        key={index}
                        className="form-panel flex flex-col justify-between !p-4 sm:!p-5 md:!p-6"
                    >
                        <div className="flex justify-between items-start sm:items-center">

                            <div>
                                <p className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-slate-400 uppercase">
                                    {card.title}
                                </p>

                                <h1 className="font-cinzel text-lg sm:text-xl md:text-3xl font-bold text-white mt-1">
                                    {card.value}
                                </h1>
                            </div>

                            <Icon
                                className={`${card.color} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mt-1 sm:mt-0`}
                            />

                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default SummaryCards;