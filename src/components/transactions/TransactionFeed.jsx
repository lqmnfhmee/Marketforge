import { useWallet } from "../context/WalletContext";

import TransactionItem from "./TransactionItem";

function TransactionFeed() {
    const { transactions } =
        useWallet();

    return (
        <div className="form-panel">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <h2 className="font-cinzel text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                    Transaction Feed
                </h2>

                <input
                    placeholder="Search..."
                    className="input-fantasy py-2 px-4 w-full sm:w-64"
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