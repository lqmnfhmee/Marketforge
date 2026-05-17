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
        <div
            className="
        bg-[#1e293b]
        rounded-2xl
        p-5
        text-white
        flex
        justify-between
        items-center
      "
        >
            <div className="flex gap-4">

                <div
                    className="
            w-12
            h-12
            rounded-xl
            bg-[#0f172a]
            flex
            items-center
            justify-center
          "
                >
                    <Icon size={20} />
                </div>

                <div>
                    <h3 className="font-semibold">
                        {transaction.category}
                    </h3>

                    <p className="text-sm text-gray-400">
                        {transaction.note ||
                            "No note"}
                    </p>
                </div>

            </div>

            <div
                className={
                    transaction.type ===
                        "income"
                        ? "text-green-400"
                        : "text-red-400"
                }
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