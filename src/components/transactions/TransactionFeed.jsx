import { useWallet } from "../context/WalletContext";

import TransactionItem from "./TransactionItem";

function TransactionFeed() {
    const { transactions } =
        useWallet();

    return (
        <div
            className="
        bg-[#111827]
        rounded-3xl
        p-6
      "
        >
            <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold text-white">
                    Transaction Feed
                </h2>

                <input
                    placeholder="Search..."
                    className="
            bg-[#1e293b]
            text-white
            px-4
            py-2
            rounded-xl
            outline-none
          "
                />

            </div>

            <div className="space-y-4 mt-6">

                {[...transactions]
                    .reverse()
                    .map((transaction, index) => (
                        <TransactionItem
                            key={index}
                            transaction={transaction}
                        />
                    ))}

            </div>

        </div>
    );
}

export default TransactionFeed;