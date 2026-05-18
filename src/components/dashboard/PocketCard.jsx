import { useNavigate } from "react-router-dom";
import { usePockets } from "../context/PocketContext";
import { WalletCards } from "lucide-react";

function PocketCard() {
  const navigate = useNavigate();
  const { pockets } = usePockets();

  const totalBalance = pockets.reduce(
    (sum, p) => sum + p.balance,
    0
  );

  return (
    <button
      onClick={() => navigate("/pockets")}
      className="form-panel text-left flex flex-col justify-between h-full min-h-[300px] group"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-400/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-slate-400/10 transition-colors duration-700" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            Savings Pockets
          </h2>
          <p className="text-gray-400 text-sm mt-1">Total Stashed</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
          <WalletCards size={24} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
        </div>
      </div>

      {/* Balance */}
      <div className="relative z-10 mb-8">
        <h1 
          className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 tracking-tight"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {totalBalance.toLocaleString()}
        </h1>
      </div>

      {/* Avatars / Pockets */}
      <div className="relative z-10 mt-auto pt-6 border-t border-[#1a1f2e]">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {pockets.length === 0 && (
            <p className="text-gray-500 text-sm italic group-hover:text-gray-400 transition-colors">
              No pockets yet — click to create one
            </p>
          )}

          {pockets.map((pocket) => (
            <div
              key={pocket.id}
              title={pocket.name}
              className="
                w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#334155]
                overflow-hidden bg-[#1a1f2e] flex items-center justify-center
                shadow-[0_4px_10px_rgba(0,0,0,0.3)] group-hover:border-slate-400 transition-colors
              "
            >
              {pocket.image ? (
                <img
                  src={pocket.image}
                  className="w-full h-full object-cover"
                  alt={pocket.name}
                />
              ) : (
                <span className="text-sm font-bold text-slate-300" style={{ fontFamily: "'Cinzel', serif" }}>
                  {pocket.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

export default PocketCard;