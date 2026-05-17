import { Plus, Trash2 } from "lucide-react";

function CraftingExpenses({
    butcherFee, setButcherFee,
    cookFee, setCookFee,
    ingredients, addIngredient, updateIngredient, removeIngredient,
    onSubmitTransaction,
    isSubmitting
}) {

    return (
        <div className="form-panel flex flex-col">
            <div className="relative z-10 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Crafting Expenses
                </h2>

                {/* Fees */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Butcher Fee */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Butcher Fee</label>
                        <input
                            type="text"
                            value={butcherFee === '' || butcherFee === undefined ? '' : Number(butcherFee).toLocaleString()}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/,/g, '');
                                if (/^\d*$/.test(rawValue)) {
                                    setButcherFee(rawValue ? Number(rawValue) : '');
                                }
                            }}
                            className="input-fantasy font-bold"
                            style={{ fontFamily: "'Cinzel', serif" }}
                            placeholder="0"
                        />
                    </div>

                    {/* Cook Fee */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cook Fee</label>
                        <input
                            type="text"
                            value={cookFee === '' || cookFee === undefined ? '' : Number(cookFee).toLocaleString()}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/,/g, '');
                                if (/^\d*$/.test(rawValue)) {
                                    setCookFee(rawValue ? Number(rawValue) : '');
                                }
                            }}
                            className="input-fantasy font-bold"
                            style={{ fontFamily: "'Cinzel', serif" }}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mt-8 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Ingredients
                        </h3>

                        <button
                            onClick={addIngredient}
                            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div className="space-y-3">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 sm:gap-3">
                                {/* Ingredient Name */}
                                <input
                                    placeholder="Name"
                                    value={ingredient.name}
                                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                    className="col-span-6 sm:col-span-7 input-fantasy !px-3"
                                />

                                {/* Cost */}
                                <input
                                    type="text"
                                    placeholder="Cost"
                                    value={ingredient.cost === '' || ingredient.cost === undefined ? '' : Number(ingredient.cost).toLocaleString()}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        if (/^\d*$/.test(rawValue)) {
                                            updateIngredient(index, "cost", rawValue ? Number(rawValue) : '');
                                        }
                                    }}
                                    className="col-span-4 input-fantasy font-bold !px-3"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />

                                {/* Remove */}
                                <button
                                    onClick={() => removeIngredient(index)}
                                    className="col-span-2 sm:col-span-1 btn-danger !p-0 flex items-center justify-center !min-h-0"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
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

export default CraftingExpenses;