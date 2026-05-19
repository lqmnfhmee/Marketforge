import { BookOpen } from "lucide-react";

function NotesCard() {
  return (
    <div className="form-panel flex flex-col group shrink-0">
      {/* Background handled by .form-panel */}
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
            <BookOpen size={20} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            Guild Notes
          </h2>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex">
        <textarea
          placeholder="Write your economy plans..."
          className="
            w-full flex-1 min-h-[120px] bg-[#0b0f19]/80 backdrop-blur-sm rounded-2xl p-5
            resize-y outline-none border border-[#1a1f2e] focus:border-slate-500
            text-slate-300 placeholder-slate-600 transition-colors custom-scrollbar font-[Inter]
          "
        />
      </div>
    </div>
  );
}

export default NotesCard;