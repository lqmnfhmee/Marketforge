import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import TransactionItem from "./TransactionItem";

function TransactionFeed() {
    const { transactions } = useWallet();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = transactions.filter((t) => {
        const term = searchTerm.toLowerCase();
        const matchesCategory = t.category?.toLowerCase().includes(term);
        const matchesNote = t.note?.toLowerCase().includes(term);
        return matchesCategory || matchesNote;
    });

    // Limit to latest 15 transactions
    const latestTransactions = [...filteredTransactions].reverse().slice(0, 15);

    return (
        <div className="form-panel flex flex-col h-[600px] relative">
            
            {/* Static Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 mb-6 z-10">
                <h2 className="font-cinzel text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                    Transaction History
                </h2>

                <input
                    placeholder="Search..."
                    className="input-fantasy py-2 px-4 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Scrollable Transaction List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8 space-y-4 relative z-0">
                {latestTransactions.map((transaction, index) => (
                    <TransactionItem
                        key={index}
                        transaction={transaction}
                    />
                ))}
            </div>

            {/* Subtle bottom fade to indicate scrolling content */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b101c] via-[#0b101c]/80 to-transparent pointer-events-none rounded-b-3xl z-10"></div>
        </div>
    );
}

export default TransactionFeed;