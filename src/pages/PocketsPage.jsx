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
        <SkeletonTheme baseColor="#0b101c" highlightColor="#1a1f2e">
            <div className="flex bg-transparent min-h-screen">

                <Sidebar />

                {/* offset for mobile nav bars */}
                <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">

                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">
                            Pocket Savings
                        </h1>

                        <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-[Inter]">
                            Total Pocket Balance
                        </p>

                        {/* Summary Banner */}
                        {loading ? (
                            <Skeleton height={180} borderRadius={28} className="mt-8" />
                        ) : (
                            <div className="form-panel mt-8 flex flex-col sm:flex-row items-center sm:items-start justify-between">
                                <div className="text-center sm:text-left">
                                    <h1 className="text-5xl sm:text-6xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-lg leading-none">
                                        {totalSavings.toLocaleString()}
                                    </h1>
                                    <p className="text-gray-400 mt-3 text-sm uppercase tracking-widest font-[Inter]">
                                        {pockets.length} Active Pockets
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/pockets/create")}
                                    className="btn-primary mt-6 sm:mt-0"
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