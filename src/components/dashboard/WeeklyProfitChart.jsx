import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ReferenceLine,
} from "recharts";

import { useWallet } from "../context/WalletContext";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

/* ------------------------------------------------------------------
   Season 32 constants
   Start: Apr 18 2026 | End: Jun 15 2026 | Duration: 59 days (≈ 8.5 wks)
------------------------------------------------------------------ */
const SEASON_START = new Date("2026-04-18T00:00:00");
const SEASON_END   = new Date("2026-06-15T23:59:59");
const SEASON_LABEL = "Season 32";

/* ------------------------------------------------------------------
   Colour helper — green if trending up, red if down, amber neutral
   Only considers non-future weeks.
------------------------------------------------------------------ */
function lineColor(data) {
    const active = data.filter((d) => !d.isFuture && d.profit !== null);
    if (active.length < 2) return "#fbbf24";
    const last = active[active.length - 1].profit;
    const prev = active[active.length - 2].profit;
    if (last > prev) return "#10b981";
    if (last < prev) return "#f43f5e";
    return "#fbbf24";
}

function WeeklyProfitChart() {
    const { transactions } = useWallet();
    const now = new Date();

    /* ------------------------------------------------------------------
       Build season week buckets.
       Week 1 starts on SEASON_START. Each bucket is 7 days; the last
       bucket (Wk 9) covers Jun 13-15 (3 days) — clamped to SEASON_END.
    ------------------------------------------------------------------ */
    const totalSeasonMs  = SEASON_END.getTime() - SEASON_START.getTime() + 1000; // ~59 days
    const totalSeasonDays = Math.ceil(totalSeasonMs / 86_400_000);

    const weekBoundaries = [];
    let cursor    = new Date(SEASON_START);
    let weekIndex = 1;

    while (cursor <= SEASON_END) {
        const start = new Date(cursor);
        const rawEnd = new Date(cursor);
        rawEnd.setDate(rawEnd.getDate() + 7);

        // Clamp: don't go past the season end
        const end = rawEnd > new Date(SEASON_END.getTime() + 1)
            ? new Date(SEASON_END.getTime() + 1)
            : rawEnd;

        weekBoundaries.push({ start, end, index: weekIndex });
        weekIndex++;
        cursor = rawEnd; // always step 7 days forward
    }

    /* ------------------------------------------------------------------
       Determine current week index (0-based)
    ------------------------------------------------------------------ */
    const currentWeekIdx = weekBoundaries.findIndex(
        ({ start, end }) => now >= start && now < end
    );

    /* ------------------------------------------------------------------
       Aggregate transactions into each season week
    ------------------------------------------------------------------ */
    const chartData = weekBoundaries.map(({ start, end, index }) => {
        const isFuture  = now < start;
        const isCurrent = now >= start && now < end;

        let weeklyIncome = 0;
        let weeklyExpense = 0;

        if (!isFuture) {
            transactions.forEach((t) => {
                if (t.category === "Balance Adjustment") return;
                if (t.category === "Pocket Transfer") return;

                const ts = new Date(t.created_at || t.timestamp).getTime();
                if (ts < start.getTime() || ts >= end.getTime()) return;
                if (t.type === "income")       weeklyIncome  += Number(t.amount);
                else if (t.type === "expense") weeklyExpense += Number(t.amount);
            });
        }

        // Display range e.g. "Apr 18 – Apr 24"
        const endDisplay = new Date(end.getTime() - 1);
        const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        const dateRange = `${fmt(start)} – ${fmt(endDisplay)}`;

        return {
            week:      `Wk ${index}`,
            profit:    isFuture ? null : weeklyIncome - weeklyExpense,
            isFuture,
            isCurrent,
            isPast:    !isFuture && !isCurrent,
            dateRange,
        };
    });

    /* ------------------------------------------------------------------
       Season-to-date totals (past + current weeks only)
    ------------------------------------------------------------------ */
    const seasonProfit    = chartData
        .filter((d) => !d.isFuture)
        .reduce((sum, d) => sum + (d.profit ?? 0), 0);
    const isPositiveSeason = seasonProfit >= 0;
    const isBreakEven      = seasonProfit === 0;

    const activeLine  = lineColor(chartData);
    const hasAnyData  = chartData.some((d) => !d.isFuture && d.profit !== 0);

    const currentWeekNum = currentWeekIdx >= 0 ? currentWeekIdx + 1 : null;

    // Season progress %
    const daysSinceStart = Math.max(
        0,
        Math.floor((now.getTime() - SEASON_START.getTime()) / 86_400_000)
    );
    const progressPct = Math.min(100, Math.round((daysSinceStart / totalSeasonDays) * 100));

    return (
        <div className="form-panel flex flex-col min-h-[400px] h-full group">

            {/* ── Header ── */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
                        <Activity size={20} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2
                                className="text-xl font-bold text-white tracking-wide"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Weekly Profit Trend
                            </h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/25 text-[#fbbf24] uppercase tracking-wider">
                                {SEASON_LABEL}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-[Inter]">
                            {currentWeekNum
                                ? `Week ${currentWeekNum} of ${weekBoundaries.length} · Apr 18 – Jun 15`
                                : "Apr 18 – Jun 15, 2026"}
                        </p>
                    </div>
                </div>

                {/* Season-to-date profit badge */}
                <div className="text-left sm:text-right bg-[#0b0f19]/50 px-4 py-2 rounded-2xl border border-[#1a1f2e]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Season total
                    </p>
                    <div className="flex items-center sm:justify-end gap-2">
                        {isBreakEven ? null : isPositiveSeason ? (
                            <TrendingUp size={16} className="text-[#10b981]" />
                        ) : (
                            <TrendingDown size={16} className="text-[#f43f5e]" />
                        )}
                        <p
                            className={`text-xl font-bold tracking-tight ${
                                isBreakEven
                                    ? "text-slate-400"
                                    : isPositiveSeason
                                    ? "text-[#10b981]"
                                    : "text-[#f43f5e]"
                            }`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {isPositiveSeason && !isBreakEven ? "+" : ""}
                            {seasonProfit.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Season progress bar ── */}
            <div className="relative z-10 mb-5">
                <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                    <span>Apr 18</span>
                    <span className="text-slate-500 font-bold">{progressPct}% complete</span>
                    <span>Jun 15</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${progressPct}%`,
                            background: "linear-gradient(to right, #d97706, #fbbf24)",
                        }}
                    />
                </div>
            </div>

            {/* ── Chart ── */}
            <div className="relative z-10 flex-1 w-full">
                {!hasAnyData ? (
                    <div className="flex flex-col items-center justify-center h-[240px] text-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#1a1f2e] flex items-center justify-center mb-2">
                            <Activity size={22} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">No season data yet</p>
                        <p className="text-slate-600 text-xs">
                            Add transactions to track your {SEASON_LABEL} performance
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid stroke="#1a1f2e" strokeDasharray="4 4" vertical={false} />

                            {/* Custom X-axis ticks: current week in amber, future in dark gray */}
                            <XAxis
                                dataKey="week"
                                stroke="#64748b"
                                axisLine={false}
                                tickLine={false}
                                tick={(props) => {
                                    const { x, y, payload, index } = props;
                                    const entry = chartData[index];
                                    const color  = entry?.isFuture
                                        ? "#1f2937"
                                        : entry?.isCurrent
                                        ? "#fbbf24"
                                        : "#64748b";
                                    const weight = entry?.isCurrent ? "700" : "400";
                                    return (
                                        <text
                                            x={x} y={y + 14}
                                            textAnchor="middle"
                                            fontSize={10}
                                            fontFamily="'Inter', sans-serif"
                                            fill={color}
                                            fontWeight={weight}
                                        >
                                            {payload.value}
                                        </text>
                                    );
                                }}
                            />

                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "'Inter', sans-serif" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => {
                                    const a = Math.abs(v);
                                    if (a >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
                                    if (a >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
                                    return v;
                                }}
                                dx={-10}
                            />

                            <ReferenceLine y={0} stroke="#334155" strokeWidth={1.5} strokeDasharray="3 3" />

                            {/* Rich tooltip with date range + future state */}
                            <Tooltip
                                cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }}
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const entry   = chartData.find((d) => d.week === label);
                                    const profit  = payload[0]?.value;
                                    const isPos   = profit >= 0;
                                    const isBE    = profit === 0;
                                    return (
                                        <div
                                            className="bg-[#0b0f19] border border-[#1a1f2e] shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md rounded-xl p-3 min-w-[175px]"
                                            style={{ fontFamily: "'Inter', sans-serif" }}
                                        >
                                            <p className="text-[#fbbf24] text-[10px] font-bold uppercase tracking-widest mb-0.5">
                                                {label}
                                                {entry?.isCurrent ? " · Current week" : entry?.isFuture ? " · Upcoming" : ""}
                                            </p>
                                            <p className="text-slate-500 text-[10px] mb-2">{entry?.dateRange}</p>
                                            {entry?.isFuture ? (
                                                <p className="text-slate-600 text-xs italic">Not yet played</p>
                                            ) : (
                                                <>
                                                    <p
                                                        className={`font-bold text-lg ${
                                                            isBE ? "text-slate-400" : isPos ? "text-[#10b981]" : "text-[#f43f5e]"
                                                        }`}
                                                        style={{ fontFamily: "'Cinzel', serif" }}
                                                    >
                                                        {isPos && !isBE ? "+" : ""}
                                                        {(profit ?? 0).toLocaleString()} silver
                                                    </p>
                                                    <p className="text-[10px] text-slate-600 mt-0.5">
                                                        {isBE ? "Break-even" : isPos ? "Net profit" : "Net loss"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="profit"
                                stroke={activeLine}
                                strokeWidth={2.5}
                                connectNulls={false}
                                dot={(props) => {
                                    const { cx, cy, index } = props;
                                    if (cy === null || cy === undefined) return null;
                                    const entry = chartData[index];
                                    if (entry?.isFuture) return null;
                                    const color  = entry?.isCurrent ? "#fbbf24" : activeLine;
                                    const radius = entry?.isCurrent ? 5 : 4;
                                    const sw     = entry?.isCurrent ? 3 : 2;
                                    return (
                                        <circle
                                            key={`dot-${index}`}
                                            cx={cx} cy={cy}
                                            r={radius}
                                            fill="#111827"
                                            stroke={color}
                                            strokeWidth={sw}
                                        />
                                    );
                                }}
                                activeDot={{ r: 6, fill: activeLine, stroke: "#111827", strokeWidth: 3 }}
                                animationDuration={1200}
                                animationEasing="ease-out"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="relative z-10 mt-4 pt-4 border-t border-[#1a1f2e] flex items-center justify-between text-xs text-slate-600">
                <span>Wk 1 — Season start</span>
                <span className="text-[10px] uppercase tracking-widest">Weekly net profit / loss</span>
                <span>
                    {currentWeekNum
                        ? <span className="text-[#fbbf24]/70">Wk {currentWeekNum} now</span>
                        : "Season end"}
                </span>
            </div>
        </div>
    );
}

export default WeeklyProfitChart;