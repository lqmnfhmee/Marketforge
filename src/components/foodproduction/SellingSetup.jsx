import { MailCheck } from "lucide-react";

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
                        Final Sale Result
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                        Enter values from your Albion market mail after items are sold.
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

                {/* Actual Silver Received */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Actual Silver Received
                    </label>
                    <input
                        type="text"
                        value={
                            props.actualSilverReceived === "" || props.actualSilverReceived === undefined
                                ? ""
                                : Number(props.actualSilverReceived).toLocaleString()
                        }
                        onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, "");
                            if (/^\d*$/.test(raw)) {
                                props.setActualSilverReceived(raw ? Number(raw) : "");
                            }
                        }}
                        className="input-fantasy font-bold"
                        style={{ fontFamily: "'Cinzel', serif" }}
                        placeholder="0"
                    />
                    <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1.5">
                        <MailCheck size={11} className="text-slate-500 shrink-0" />
                        Copy the exact silver amount from your Albion market mail.
                    </p>
                </div>

                {/* Live summary row — only shown when value is entered */}
                {Number(props.actualSilverReceived) > 0 && (
                    <div className="flex items-center justify-between bg-[#0b0f19]/80 border border-[#1a1f2e] px-4 py-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Silver Received
                        </span>
                        <span
                            className="text-[#34d399] font-bold text-lg"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {Number(props.actualSilverReceived).toLocaleString()}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default SellingSetup;