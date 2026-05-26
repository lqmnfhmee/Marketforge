import { useState } from "react";
import { MailCheck, CheckCircle2, Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

/* ─── Status badge ──────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const isPending = status === "pending" || !status;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                isPending
                    ? "bg-amber-900/20 text-amber-400 border-amber-700/30"
                    : "bg-emerald-900/20 text-emerald-400 border-emerald-700/30"
            }`}
        >
            {isPending ? <Clock size={10} /> : <CheckCircle2 size={10} />}
            {isPending ? "Pending Sale" : "Sale Completed"}
        </span>
    );
}

/* ─── Complete Sale inline form ─────────────────────────────────────────── */
function CompleteSaleForm({ session, onComplete }) {
    const [silver, setSilver] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        const amount = Number(silver.replace(/,/g, ""));
        if (!amount || amount <= 0) {
            toast.error("Enter a valid silver amount.");
            return;
        }
        setSaving(true);
        const profit = amount - Number(session.total_expenses || 0);
        const { error } = await supabase
            .from("food_production_sessions")
            .update({
                actual_silver_received: amount,
                profit,
                sale_status: "completed",
            })
            .eq("id", session.id);
        setSaving(false);
        if (error) {
            toast.error("Failed to complete sale.");
        } else {
            toast.success("Sale completed!");
            onComplete(session.id, amount, profit);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-[#1a1f2e] space-y-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <MailCheck size={11} className="text-amber-400" />
                Enter silver from Albion market mail
            </p>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={silver}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (/^\d*$/.test(raw)) {
                            setSilver(raw ? Number(raw).toLocaleString() : "");
                        }
                    }}
                    placeholder="Actual silver received"
                    className="input-fantasy flex-1 !py-2 text-sm"
                    style={{ fontFamily: "'Cinzel', serif" }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="btn-primary !py-2 !px-4 text-xs whitespace-nowrap"
                >
                    {saving ? "Saving…" : "Complete Sale"}
                </button>
            </div>
        </div>
    );
}

/* ─── Single session card ───────────────────────────────────────────────── */
function SessionCard({ session, index, onDelete, onComplete }) {
    const [showComplete, setShowComplete] = useState(false);
    const isPending = session.sale_status === "pending" || !session.sale_status;
    const profit = Number(session.profit ?? 0);
    const profitable = profit >= 0;

    return (
        <div className="form-panel relative overflow-hidden">
            {/* Subtle status glow */}
            <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                    isPending
                        ? "bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
                        : "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
                }`}
            />

            {/* Delete button */}
            <button
                onClick={() => onDelete(index, session.id)}
                className="absolute top-4 right-4 text-slate-600 hover:text-rose-400 transition-colors z-10"
                title="Delete session"
            >
                <Trash2 size={16} />
            </button>

            {/* Header */}
            <div className="mb-4 pr-8">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                    <h3
                        className="text-lg font-bold text-white tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {session.item_name || "Unnamed Item"}
                    </h3>
                    <StatusBadge status={session.sale_status} />
                </div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    {new Date(session.created_at).toLocaleString()}
                </p>
            </div>

            {/* Stats grid */}
            <div className="space-y-2 bg-[#0b0f19]/60 border border-[#1a1f2e] p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                <div className="flex justify-between text-slate-400">
                    <span>Quantity</span>
                    <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        {Number(session.crafted_amount || 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-slate-400">
                    <span>Farming</span>
                    <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        {Number(session.farming_expenses || 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-slate-400">
                    <span>Crafting</span>
                    <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        {Number(session.crafting_expenses || 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-[#1a1f2e] pt-2">
                    <span>Total Expenses</span>
                    <span className="text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                        {Number(session.total_expenses || 0).toLocaleString()}
                    </span>
                </div>

                {/* Completed: show silver received + profit */}
                {!isPending && (
                    <>
                        <div className="flex justify-between text-slate-400 border-t border-[#1a1f2e] pt-2">
                            <span>Silver Received</span>
                            <span className="text-emerald-400" style={{ fontFamily: "'Cinzel', serif" }}>
                                {Number(session.actual_silver_received || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-[#1a1f2e] pt-2">
                            <span className={profitable ? "text-emerald-400" : "text-rose-400"}>
                                Final Profit
                            </span>
                            <span
                                className={`font-bold ${profitable ? "text-emerald-400" : "text-rose-400"}`}
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {profitable ? "+" : ""}{profit.toLocaleString()}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Pending: Complete Sale toggle */}
            {isPending && (
                <div className="mt-4">
                    <button
                        onClick={() => setShowComplete((v) => !v)}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-amber-700/30 bg-amber-900/10 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-900/20 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <MailCheck size={13} />
                            Complete Sale
                        </span>
                        {showComplete ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showComplete && (
                        <CompleteSaleForm
                            session={session}
                            onComplete={(id, silver, profit) => {
                                setShowComplete(false);
                                onComplete(id, silver, profit);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Main SavedSessions component ─────────────────────────────────────── */
function SavedSessions({ sessions, setSessions }) {
    if (!sessions || sessions.length === 0) return null;

    const pendingCount = sessions.filter(
        (s) => s.sale_status === "pending" || !s.sale_status
    ).length;
    const completedCount = sessions.length - pendingCount;

    const handleDelete = async (index, sessionId) => {
        if (sessionId) {
            const { error } = await supabase
                .from("food_production_sessions")
                .delete()
                .eq("id", sessionId);
            if (error) {
                toast.error("Failed to delete session.");
                return;
            }
        }
        setSessions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleComplete = (id, silver, profit) => {
        setSessions((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, actual_silver_received: silver, profit, sale_status: "completed" }
                    : s
            )
        );
    };

    return (
        <div className="mt-12">
            {/* Section header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2
                        className="text-2xl font-bold text-white tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Production Sessions
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                        Track each production run from cost to completed sale.
                    </p>
                </div>
                <div className="flex gap-3">
                    {pendingCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-900/20 text-amber-400 border border-amber-700/30">
                            <Clock size={10} />
                            {pendingCount} Pending
                        </span>
                    )}
                    {completedCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-900/20 text-emerald-400 border border-emerald-700/30">
                            <CheckCircle2 size={10} />
                            {completedCount} Completed
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, i) => (
                    <SessionCard
                        key={session.id || i}
                        session={session}
                        index={i}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                    />
                ))}
            </div>
        </div>
    );
}

export default SavedSessions;
