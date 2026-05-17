import { X } from "lucide-react";
import { useState } from "react";

function SubmitModal({ isOpen, onClose, onSubmit, modalData }) {
    const [hideConfirm, setHideConfirm] = useState(false);
    
    if (!isOpen || !modalData) return null;

    const handleConfirm = () => {
        if (hideConfirm) {
            localStorage.setItem("hideFoodSubmitConfirm", "true");
        }
        onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/80 backdrop-blur-md p-4">
            <div className="form-panel max-w-md w-full relative">
                <div className="relative z-10">
                    <button 
                        onClick={onClose}
                        className="absolute -top-2 -right-2 text-slate-500 hover:text-white transition-colors hover:rotate-90 duration-300"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                        Confirm Ledger Entry
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between border-b border-[#1a1f2e] pb-3">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Item Name</span>
                            <span className="text-white font-medium">{modalData.itemName || "Unnamed Item"}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1a1f2e] pb-3">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Session Type</span>
                            <span className="text-white font-medium capitalize">{modalData.sessionType}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1a1f2e] pb-3">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Category</span>
                            <span className="text-white font-medium">{modalData.category}</span>
                        </div>
                        <div className="flex justify-between pt-2 items-center">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Total Amount</span>
                            <span className="text-[#f43f5e] font-bold text-lg" style={{ fontFamily: "'Cinzel', serif" }}>
                                - {Number(modalData.amount).toLocaleString()} Silver
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                        <input 
                            type="checkbox" 
                            id="hideConfirm" 
                            checked={hideConfirm}
                            onChange={(e) => setHideConfirm(e.target.checked)}
                            className="w-5 h-5 rounded bg-[#0b0f19] border border-[#1a1f2e] text-[#fbbf24] focus:ring-[#fbbf24]/50 focus:ring-offset-0 focus:ring-2 cursor-pointer transition-all"
                        />
                        <label htmlFor="hideConfirm" className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">
                            Do not show again for this session type
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="btn-primary flex-1"
                        >
                            Confirm Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmitModal;
