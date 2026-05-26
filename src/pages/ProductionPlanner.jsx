import { useState } from "react";

function ProductionPlanner() {

    // =========================
    // MARKET VARIABLES
    // =========================

    const [babyPrice, setBabyPrice] = useState("");
    const [adultPrice, setAdultPrice] = useState("");
    const [mountPrice, setMountPrice] = useState("");
    const [foodPrice, setFoodPrice] = useState("");


    // =========================
    // INFRASTRUCTURE
    // =========================

    const [islandCount, setIslandCount] = useState("");
    const [kennelCount, setKennelCount] = useState("");
    const [cycleDuration, setCycleDuration] = useState("");


    // =========================
    // CALCULATIONS
    // =========================

    const grossRevenue =
        Number(mountPrice || 0) *
        Number(kennelCount || 0);

    const foodCost =
        Number(foodPrice || 0) *
        Number(kennelCount || 0) *
        Number(cycleDuration || 0);

    const investment =
        Number(babyPrice || 0) *
        Number(kennelCount || 0);

    const netProfit =
        grossRevenue -
        foodCost -
        investment;

    const roi =
        investment > 0
            ? (netProfit / investment) * 100
            : 0;

    const profitPerDay =
        cycleDuration > 0
            ? netProfit / cycleDuration
            : 0;


    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-2">
                Production Planner
            </h1>

            <p className="text-gray-600 mb-8">
                Simulate profitability before running production operations.
            </p>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                {/* LEFT SIDE */}
                <div className="space-y-6">


                    {/* MARKET VARIABLES */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Market Variables
                        </h2>

                        <div className="space-y-4">

                            <input
                                type="number"
                                placeholder="Baby Animal Price"
                                value={babyPrice}
                                onChange={(e) =>
                                    setBabyPrice(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Adult Animal Price"
                                value={adultPrice}
                                onChange={(e) =>
                                    setAdultPrice(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Mount Price"
                                value={mountPrice}
                                onChange={(e) =>
                                    setMountPrice(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Food Price"
                                value={foodPrice}
                                onChange={(e) =>
                                    setFoodPrice(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                    </div>



                    {/* INFRASTRUCTURE */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Infrastructure Setup
                        </h2>

                        <div className="space-y-4">

                            <input
                                type="number"
                                placeholder="Island Count"
                                value={islandCount}
                                onChange={(e) =>
                                    setIslandCount(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Kennel Count"
                                value={kennelCount}
                                onChange={(e) =>
                                    setKennelCount(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Cycle Duration (Days)"
                                value={cycleDuration}
                                onChange={(e) =>
                                    setCycleDuration(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                    </div>

                </div>



                {/* RIGHT SIDE */}
                <div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-6">
                            Production Results
                        </h2>


                        <div className="space-y-6">


                            <div>
                                <p className="text-gray-500">
                                    Gross Revenue
                                </p>

                                <h3 className="text-3xl font-bold">
                                    {grossRevenue.toLocaleString()}
                                </h3>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Food Cost
                                </p>

                                <h3 className="text-3xl font-bold text-red-500">
                                    {foodCost.toLocaleString()}
                                </h3>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Net Profit
                                </p>

                                <h3
                                    className={`text-4xl font-bold ${
                                        netProfit >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {netProfit.toLocaleString()}
                                </h3>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    ROI
                                </p>

                                <h3 className="text-3xl font-bold">
                                    {roi.toFixed(2)}%
                                </h3>
                            </div>


                            <div>
                                <p className="text-gray-500">
                                    Profit Per Day
                                </p>

                                <h3 className="text-3xl font-bold">
                                    {profitPerDay.toFixed(0)}
                                </h3>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ProductionPlanner;