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
        group relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full
        bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d]
        border border-[#dc2626] shadow-[0_4px_15px_rgba(153,27,27,0.3)]
        hover:shadow-[0_6px_25px_rgba(153,27,27,0.5)] hover:border-white/30
        hover:-translate-y-0.5 transition-all duration-300
        text-white overflow-hidden
      "
    >
      {/* Inner highlight for metallic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none rounded-full" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 blur-md transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center">
        <Coins size={16} className="text-[#fbbf24] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
      </div>

      <span 
        className="relative z-10 text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {goldBalance.toLocaleString()}
      </span>
    </button>
  );
}

export default GoldCard;