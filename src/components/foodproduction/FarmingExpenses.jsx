function Input({ label, value, setter }) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {label}
            </label>

            <input
                type="text"
                value={value === '' || value === undefined ? '' : Number(value).toLocaleString()}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    if (/^\d*$/.test(rawValue)) {
                        setter(rawValue ? Number(rawValue) : '');
                    }
                }}
                className="input-fantasy font-bold"
                style={{ fontFamily: "'Cinzel', serif" }}
                placeholder="0"
            />
        </div>
    );
}

function FarmingExpenses({
    babyAnimalCost, setBabyAnimalCost,
    foodCost, setFoodCost,
    seedCost, setSeedCost,
    travelCost, setTravelCost,
    onSubmitTransaction,
    isSubmitting
}) {

    return (
        <div className="form-panel flex flex-col">
            <div className="relative z-10 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Farming Expenses
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <Input
                        label="Baby Animal Cost"
                        value={babyAnimalCost}
                        setter={setBabyAnimalCost}
                    />

                    <Input
                        label="Food Cost"
                        value={foodCost}
                        setter={setFoodCost}
                    />

                    <Input
                        label="Seed Cost"
                        value={seedCost}
                        setter={setSeedCost}
                    />

                    <Input
                        label="Travel Cost"
                        value={travelCost}
                        setter={setTravelCost}
                    />
                </div>

                <div className="mt-6 pt-6 border-t border-[#1a1f2e] mt-auto">
                    <button
                        onClick={onSubmitTransaction}
                        disabled={isSubmitting}
                        className="btn-primary w-full"
                    >
                        {isSubmitting ? "Submitting..." : "Submit To Ledger"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FarmingExpenses;