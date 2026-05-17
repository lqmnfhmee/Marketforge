import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

function GoldCard() {
  const navigate = useNavigate();
  const { goldBalance } = useWallet();

  return (
    <button
      onClick={() => navigate("/gold")}
      className="
        group relative flex items-center gap-3 px-5 py-2.5 rounded-2xl
        bg-gradient-to-b from-[#f59e0b] to-[#d97706]
        border border-[#fbbf24] shadow-[0_4px_15px_rgba(245,158,11,0.2)]
        hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] hover:border-white/50
        hover:-translate-y-0.5 transition-all duration-300
        text-[#1a1f2e] overflow-hidden
      "
    >
      {/* Inner highlight for metallic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/30 pointer-events-none rounded-2xl" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 blur-md transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center p-1.5 bg-[#1a1f2e]/10 rounded-full shadow-inner">
        <Coins size={20} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" strokeWidth={2.5} />
      </div>

      <span 
        className="relative z-10 text-xl font-bold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {goldBalance.toLocaleString()}
      </span>
    </button>
  );
}

export default GoldCard;