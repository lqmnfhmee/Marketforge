import { useNavigate }
    from "react-router-dom";

function PocketCard({
    pocket,
}) {

    const navigate =
        useNavigate();

    return (
        <button
            onClick={() => navigate(`/pockets/${pocket.id}`)}
            className="form-panel flex flex-col text-left hover:scale-[1.02] transition-transform duration-300 group"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-slate-400/10 transition-colors duration-700" />
            
            {/* Image */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.1)] mb-6 overflow-hidden shadow-inner group-hover:border-[rgba(255,215,0,0.3)] transition-colors duration-300">
                {pocket.image && (
                    <img
                        src={pocket.image}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Name */}
            <h2 className="relative z-10 text-2xl font-bold font-cinzel text-slate-200 group-hover:text-white transition-colors duration-300">
                {pocket.name}
            </h2>

            {/* Balance */}
            <p className="relative z-10 text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-cinzel">
                {pocket.balance.toLocaleString()}
            </p>

            {/* Goal */}
            {pocket.goal > 0 && (
                <div className="relative z-10 mt-5 w-full">
                    <div className="w-full bg-[#0b0f19] h-2.5 rounded-full overflow-hidden border border-[#1a1f2e]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                            style={{
                                width: `${Math.min((pocket.balance / pocket.goal) * 100, 100)}%`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-bold font-[Inter]">
                        Goal: {pocket.goal.toLocaleString()}
                    </p>
                </div>
            )}
        </button>
    );
}

export default PocketCard;