import SummaryCards from "../components/transactions/SummaryCards";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionFeed from "../components/transactions/TransactionFeed";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Sidebar from "../config/Sidebar";
import { useWallet } from "../components/context/WalletContext";

function TransactionsPage() {
    const { loading } = useWallet();

    return (
        <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
            <div className="flex bg-[#0f172a] min-h-screen">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content — offset for mobile top bar + bottom nav */}
                <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">

                    <div className="max-w-7xl mx-auto">

                        {/* Page Header */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            Transactions
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Track your Albion economy
                        </p>

                        {/* Summary Cards — skeleton or real */}
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} height={100} borderRadius={24} />
                                ))}
                            </div>
                        ) : (
                            <SummaryCards />
                        )}

                        {/* Main Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                {/* Form skeleton */}
                                <div className="col-span-1">
                                    <Skeleton height={380} borderRadius={24} />
                                </div>

                                {/* Feed skeleton */}
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <Skeleton height={60} borderRadius={16} />
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} height={72} borderRadius={16} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                                {/* Transaction Form */}
                                <div className="col-span-1">
                                    <TransactionForm />
                                </div>

                                {/* Transaction Feed */}
                                <div className="col-span-1 md:col-span-2">
                                    <TransactionFeed />
                                </div>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </SkeletonTheme>
    );
}

export default TransactionsPage;