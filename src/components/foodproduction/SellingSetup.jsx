import { Plus, Trash2 } from "lucide-react";

function SellingSetup(props) {
    const cities = [
        "Bridgewatch",
        "Martlock",
        "Fort Sterling",
        "Lymhurst",
        "Thetford",
        "Caerleon",
    ];

    return (
        <div className="form-panel flex flex-col">
            <div className="relative z-10 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                    Selling Setup
                </h2>

                {/* Top Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Item Name */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                        <input
                            value={props.itemName}
                            onChange={(e) => props.setItemName(e.target.value)}
                            className="input-fantasy"
                            placeholder="e.g. Beef Stew"
                        />
                    </div>

                    {/* Crafted Amount */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Crafted Amount</label>
                        <input
                            type="text"
                            value={props.craftedAmount === '' || props.craftedAmount === undefined ? '' : Number(props.craftedAmount).toLocaleString()}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/,/g, '');
                                if (/^\d*$/.test(rawValue)) {
                                    props.setCraftedAmount(rawValue ? Number(rawValue) : '');
                                }
                            }}
                            className="input-fantasy font-bold"
                            style={{ fontFamily: "'Cinzel', serif" }}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Distribution Stats */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest bg-[#0b0f19]/80 border border-[#1a1f2e] p-3 rounded-xl">
                    <p className="text-slate-400">
                        Total: <span className="text-white ml-1">{props.craftedAmount || 0}</span>
                    </p>
                    <p className="text-slate-400">
                        Assigned: <span className="text-white ml-1">{props.usedAmount}</span>
                    </p>
                    <p className={props.oversold ? "text-[#f43f5e]" : "text-[#34d399]"}>
                        Remaining: <span className="ml-1">{props.remainingAmount}</span>
                    </p>
                </div>

                {/* Listings */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Market Listings
                        </h3>

                        <button
                            onClick={props.addListing}
                            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div className="space-y-3">
                        {props.marketListings.map((listing, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 sm:gap-3">
                                {/* City */}
                                <select
                                    value={listing.city}
                                    onChange={(e) => props.updateListing(index, "city", e.target.value)}
                                    className="col-span-12 sm:col-span-4 input-fantasy !px-3 appearance-none cursor-pointer"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.2em 1.2em", paddingRight: "2rem" }}
                                >
                                    <option value="">City</option>
                                    {cities.map((city) => (
                                        <option key={city}>{city}</option>
                                    ))}
                                </select>

                                {/* Amount */}
                                <input
                                    type="text"
                                    placeholder="Amount"
                                    value={listing.amount === '' || listing.amount === undefined ? '' : Number(listing.amount).toLocaleString()}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        if (/^\d*$/.test(rawValue)) {
                                            props.updateListing(index, "amount", rawValue ? Number(rawValue) : '');
                                        }
                                    }}
                                    className="col-span-5 sm:col-span-3 input-fantasy font-bold !px-3"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />

                                {/* Price */}
                                <input
                                    type="text"
                                    placeholder="Price"
                                    value={listing.price === '' || listing.price === undefined ? '' : Number(listing.price).toLocaleString()}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        if (/^\d*$/.test(rawValue)) {
                                            props.updateListing(index, "price", rawValue ? Number(rawValue) : '');
                                        }
                                    }}
                                    className="col-span-5 sm:col-span-4 input-fantasy font-bold !px-3"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />

                                {/* Remove */}
                                <button
                                    onClick={() => props.removeListing(index)}
                                    className="col-span-2 sm:col-span-1 flex items-center justify-center text-slate-500 hover:text-[#f43f5e] transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Oversold Warning */}
                {props.oversold && (
                    <div className="bg-[#9f1239]/10 border border-[#9f1239]/50 text-[#f43f5e] text-sm p-3 rounded-xl mt-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
                        Assigned amount exceeds crafted quantity
                    </div>
                )}

                {/* Premium & Financials Area */}
                <div className="mt-auto pt-8">
                    {/* Premium */}
                    <div className="flex justify-between items-center bg-[#0b0f19]/80 border border-[#1a1f2e] p-4 rounded-xl mb-6">
                        <div>
                            <h3 className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Premium Status
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">
                                Lower marketplace tax
                            </p>
                        </div>

                        <button
                            onClick={() => props.setPremium(!props.premium)}
                            className={`
                                w-12 h-6 rounded-full transition-colors duration-300 relative border border-[#1a1f2e]
                                ${props.premium ? "bg-[#10b981]" : "bg-[#1e293b]"}
                            `}
                        >
                            <div
                                className={`
                                    w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-md
                                    ${props.premium ? "translate-x-7" : "translate-x-1"}
                                `}
                            />
                        </button>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-3 p-4 bg-[#0b0f19]/40 rounded-xl border border-[#1a1f2e]">
                        <div className="flex justify-between text-slate-300 text-sm font-bold">
                            <span>Gross Revenue</span>
                            <span style={{ fontFamily: "'Cinzel', serif" }}>{props.grossRevenue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-[#f43f5e] text-sm font-bold">
                            <span>Marketplace Tax</span>
                            <span style={{ fontFamily: "'Cinzel', serif" }}>-{props.marketplaceTax.toLocaleString()}</span>
                        </div>

                        <div className="border-t border-[#1a1f2e] pt-3 flex justify-between text-[#34d399] font-bold text-lg items-center">
                            <span className="tracking-widest uppercase text-xs">Net Revenue</span>
                            <span style={{ fontFamily: "'Cinzel', serif" }}>{props.netRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellingSetup;