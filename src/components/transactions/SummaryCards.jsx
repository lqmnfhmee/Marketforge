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
        <div className="grid grid-cols-4 gap-6 mt-8">

            {summary.map((card, index) => {
                const Icon = card.icon;

                return (
                    <div
                        key={index}
                        className="
              bg-[#1e293b]
              rounded-3xl
              p-6
              text-white
            "
                    >
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-gray-400">
                                    {card.title}
                                </p>

                                <h1 className="text-3xl font-bold mt-2">
                                    {card.value}
                                </h1>
                            </div>

                            <Icon
                                className={card.color}
                                size={28}
                            />

                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default SummaryCards;