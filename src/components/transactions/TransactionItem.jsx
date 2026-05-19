import {
    ShoppingCart,
    Coins,
    Truck,
    Wheat,
} from "lucide-react";

function TransactionItem({
    transaction,
}) {

    const iconMap = {
        "Market Sale": Coins,
        "Ingredient Purchase":
            ShoppingCart,
        "Transport Cost": Truck,
        "Seed Purchase": Wheat,
    };

    const Icon =
        iconMap[transaction.category] ||
        ShoppingCart;

    return (
        <div className="bg-[#0b0f19]/80 border border-[#1a1f2e] hover:border-[#fbbf24]/20 transition-colors rounded-xl p-3 sm:p-5 flex justify-between items-center group">
            <div className="flex gap-3 sm:gap-4">

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-[#fbbf24]/20 transition-colors shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="flex flex-col justify-center">
                    <h3 className="font-medium text-slate-200 text-sm sm:text-base">
                        {transaction.category}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {transaction.note ||
                            "No note"}
                    </p>
                </div>

            </div>

            <div
                className={`font-semibold text-sm sm:text-base ${
                    transaction.type ===
                        "income"
                        ? "text-green-400"
                        : "text-red-400"
                }`}
            >
                {transaction.type ===
                    "income"
                    ? "+"
                    : "-"}

                {transaction.amount.toLocaleString()}
            </div>

        </div>
    );
}

export default TransactionItem;