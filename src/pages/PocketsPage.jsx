import {
    useNavigate,
} from "react-router-dom";

import Sidebar from
    "../config/Sidebar";

import PocketCard from
    "../components/pockets/PocketCard";

import {
    usePockets,
} from "../components/context/PocketContext";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PocketsPage() {

    const navigate =
        useNavigate();

    const { pockets, loading } =
        usePockets();

    const totalSavings =
        pockets.reduce(
            (acc, pocket) =>
                acc + pocket.balance,
            0
        );

    return (
        <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
            <div className="flex bg-[#0f172a] min-h-screen">

                <Sidebar />

                {/* offset for mobile nav bars */}
                <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">

                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            Pocket Savings
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Total Pocket Balance
                        </p>

                        {/* Summary Banner */}
                        {loading ? (
                            <Skeleton height={180} borderRadius={28} className="mt-8" />
                        ) : (
                            <div
                                className="
                                    bg-[#1e293b]
                                    rounded-3xl
                                    p-6 sm:p-8
                                    text-white
                                    mt-8
                                "
                            >

                                <h1 className="text-4xl sm:text-5xl font-bold">
                                    {totalSavings.toLocaleString()}
                                </h1>

                                <p className="text-gray-400 mt-2">
                                    {pockets.length} Active Pockets
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/pockets/create"
                                        )
                                    }
                                    className="
                                        bg-purple-500
                                        px-6
                                        py-3
                                        rounded-2xl
                                        mt-6
                                        font-semibold
                                    "
                                >
                                    Create Pocket
                                </button>

                            </div>
                        )}

                        {/* Pocket Grid — 1 col mobile, 2 col sm, 3 col lg */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} height={220} borderRadius={28} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

                                {pockets.map((pocket) => (

                                    <PocketCard
                                        key={pocket.id}
                                        pocket={pocket}
                                    />

                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </SkeletonTheme>
    );
}

export default PocketsPage;