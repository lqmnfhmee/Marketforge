import { Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

function SavedSessions({ sessions, setSessions, onLoadSession }) {
    if (!sessions || sessions.length === 0) return null;

    const removeSession = async (index, sessionId) => {
        if (sessionId) {
            const { error } = await supabase
                .from("food_production_sessions")
                .delete()
                .eq("id", sessionId);
            
            if (error) {
                console.error("Error deleting session:", error);
                return;
            }
        }

        const newSessions = sessions.filter((_, i) => i !== index);
        setSessions(newSessions);
        
        if (!sessionId) {
            localStorage.setItem("food_calculation_sessions", JSON.stringify(newSessions));
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                Saved Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, i) => (
                    <div
                        key={session.id || i}
                        onClick={() => onLoadSession(session)}
                        className="form-panel relative group hover:scale-[1.02] transition-all cursor-pointer hover:border-[#fbbf24]/30 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSession(i, session.id);
                            }}
                            className="absolute top-4 right-4 text-slate-500 hover:text-[#f43f5e] transition-colors z-10"
                        >
                            <Trash2 size={18} />
                        </button>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                                    {session.item_name || session.itemName || "Unnamed Item"}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                    {new Date(session.created_at).toLocaleString()}
                                </p>
                            </div>
                            {session.profit !== undefined && (
                                <span className={`px-3 py-1 mt-1 rounded-lg text-xs font-bold border ${session.profit > 0 ? "bg-[#10b981]/10 text-[#34d399] border-[#10b981]/30" : "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30"}`}>
                                    {session.profit > 0 ? "+" : ""}{Number(session.profit).toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-2 mt-4 relative z-10 bg-[#0b0f19]/60 border border-[#1a1f2e] p-4 rounded-xl">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>Crafted</span>
                                <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>{Number(session.crafted_amount || session.craftedAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>Expenses</span>
                                <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>{Number(session.total_expenses || session.totalExpenses).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>Listings</span>
                                <span className="text-white">{(session.market_listings || session.marketListings || []).length} Cities</span>
                            </div>
                        </div>

                        {/* Hover Overlay Text */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform flex justify-center pointer-events-none z-10">
                            <span className="bg-[#0b0f19] border border-[#fbbf24]/30 text-[#fbbf24] px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                Click to Load
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SavedSessions;
