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
        <div className="bg-[#0b0f19]/80 border border-[#1a1f2e] hover:border-[#fbbf24]/20 transition-colors rounded-xl p-4 sm:p-5 flex justify-between items-center group">
            <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-[#fbbf24]/20 transition-colors">
                    <Icon size={20} />
                </div>

                <div>
                    <h3 className="font-medium text-slate-200">
                        {transaction.category}
                    </h3>

                    <p className="text-sm text-slate-500 mt-0.5">
                        {transaction.note ||
                            "No note"}
                    </p>
                </div>

            </div>

            <div
                className={`font-semibold ${
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