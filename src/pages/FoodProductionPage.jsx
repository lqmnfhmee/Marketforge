import Sidebar from "../config/Sidebar";

import FoodProductionCalculator
    from "../components/foodproduction/FoodProductionCalculator";

function FoodProductionPage() {

    return (
        <div className="flex bg-[#0f172a] min-h-screen">

            <Sidebar />

            {/* offset for mobile nav bars */}
            <div className="flex-1 p-4 sm:p-8 pt-18 lg:pt-8 pb-24 lg:pb-8">

                <div className="max-w-7xl mx-auto">

                    <h1 className="text-4xl font-bold text-white">
                        Food Production Calculator
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Analyze your Albion food production profitability
                    </p>

                    <FoodProductionCalculator />

                </div>

            </div>

        </div>
    );
}

export default FoodProductionPage;