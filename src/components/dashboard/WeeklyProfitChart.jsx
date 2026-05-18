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
   Custom tooltip — shows the net profit for the hovered day
------------------------------------------------------------------ */
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const profit = payload[0]?.value ?? 0;
    const isPositive = profit >= 0;

    return (
        <div
            className="bg-[#0b0f19] border border-[#1a1f2e] shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md rounded-xl p-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <p className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider mb-1">
                {label}
            </p>
            <p
                className={`font-bold text-lg ${
                    isPositive ? "text-[#10b981]" : "text-[#9f1239]"
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
            >
                {isPositive ? "+" : ""}
                {profit.toLocaleString()} silver
            </p>
        </div>
    );
}

function WeeklyProfitChart() {
    const { transactions } = useWallet();

    /* ------------------------------------------------------------------
       Build the last 7 calendar days starting from Monday of this week.
       We use each real calendar date so transactions are bucketed by date.
    ------------------------------------------------------------------ */
    const today = new Date();

    // Monday = 0 … Sunday = 6  (JS: Sun=0, Mon=1 … Sat=6)
    const dayOfWeek = today.getDay(); // 0 = Sun
    const mondayOffset = (dayOfWeek + 6) % 7; // days since last Monday

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - mondayOffset + i);
        return d;
    });

    /* ------------------------------------------------------------------
       Compute daily net profit:  income - expense
    ------------------------------------------------------------------ */
    const chartData = weekDays.map((date) => {
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        const dateStr = date.toDateString(); // "Mon May 13 2026"

        let dailyIncome = 0;
        let dailyExpense = 0;

        transactions.forEach((t) => {
            const txDate = new Date(
                t.created_at || t.timestamp
            ).toDateString();

            if (txDate !== dateStr) return;
            if (t.category === "Balance Adjustment") return; // exclude — not earned profit

            if (t.type === "income") {
                dailyIncome += Number(t.amount);
            } else if (t.type === "expense") {
                dailyExpense += Number(t.amount);
            }
        });

        return {
            day: label,
            profit: dailyIncome - dailyExpense,
        };
    });

    /* ------------------------------------------------------------------
       Weekly total profit (same concept — displayed in header)
    ------------------------------------------------------------------ */
    const weeklyProfit = chartData.reduce((sum, d) => sum + d.profit, 0);
    const isPositiveWeek = weeklyProfit >= 0;

    return (
        <div className="form-panel flex flex-col min-h-[400px] h-full group">
            {/* Background handled by form-panel */}
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-[rgba(255,215,0,0.05)] flex items-center justify-center group-hover:border-[rgba(255,215,0,0.2)] group-hover:bg-[#1f2937] transition-all duration-300 shadow-inner">
                        <Activity size={20} className="text-slate-300 group-hover:text-[#fbbf24] transition-colors" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                            Weekly Performance
                        </h2>
                        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-[Inter]">Daily Profit</p>
                    </div>
                </div>

                <div className="text-left sm:text-right bg-[#0b0f19]/50 px-4 py-2 rounded-2xl border border-[#1a1f2e]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">This week</p>
                    <div className="flex items-center sm:justify-end gap-2">
                        {isPositiveWeek ? (
                            <TrendingUp size={16} className="text-[#10b981]" />
                        ) : (
                            <TrendingDown size={16} className="text-[#9f1239]" />
                        )}
                        <p
                            className={`text-xl font-bold tracking-tight ${
                                isPositiveWeek
                                    ? "text-[#10b981]"
                                    : "text-[#9f1239]"
                            }`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {isPositiveWeek ? "+" : ""}
                            {weeklyProfit.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex-1 w-full mt-4">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            stroke="#1a1f2e"
                            strokeDasharray="4 4"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />

                        <YAxis 
                            stroke="#64748b" 
                            tick={{ fill: '#64748b', fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => {
                                if (value >= 1000000 || value <= -1000000) return `${(value / 1000000).toFixed(1)}m`;
                                if (value >= 1000 || value <= -1000) return `${(value / 1000).toFixed(0)}k`;
                                return value;
                            }}
                            dx={-10}
                        />

                        {/* Zero baseline so negative profit days show clearly */}
                        <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#111827",
                                stroke: "#fbbf24",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#fbbf24",
                                stroke: "#111827",
                                strokeWidth: 3,
                            }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default WeeklyProfitChart;