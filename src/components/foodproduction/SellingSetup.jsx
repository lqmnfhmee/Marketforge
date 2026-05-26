function SellingSetup(props) {
    return (
        <div className="form-panel flex flex-col">
            <div className="relative z-10 flex flex-col gap-6">

                {/* Header */}
                <div>
                    <h2
                        className="text-xl font-bold text-white tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Production Details
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                        Name your production run and record how many items you crafted.
                    </p>
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Product Name
                    </label>
                    <input
                        value={props.itemName}
                        onChange={(e) => props.setItemName(e.target.value)}
                        className="input-fantasy"
                        placeholder="e.g. Pork Omelette"
                    />
                </div>

                {/* Quantity Produced */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Quantity Produced
                    </label>
                    <input
                        type="text"
                        value={
                            props.craftedAmount === "" || props.craftedAmount === undefined
                                ? ""
                                : Number(props.craftedAmount).toLocaleString()
                        }
                        onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, "");
                            if (/^\d*$/.test(raw)) {
                                props.setCraftedAmount(raw ? Number(raw) : "");
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                        placeholder="0"
                    />
                </div>

                {/* Workflow tip */}
                <div className="px-4 py-3 rounded-xl bg-[#0b0f19]/80 border border-[#1a1f2e]">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">
                        Workflow
                    </p>
                    <ol className="space-y-1.5 text-xs text-slate-500">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">1.</span>
                            Fill farming &amp; crafting costs above.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">2.</span>
                            Save the production session.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">3.</span>
                            Sell items in Albion and wait for market mail.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">4.</span>
                            Return here, open the saved session, and enter actual silver received.
                        </li>
                    </ol>
                </div>

            </div>
        </div>
    );
}

export default SellingSetup;