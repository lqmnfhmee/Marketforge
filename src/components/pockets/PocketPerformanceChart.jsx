import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

function PocketPerformanceChart({
    activity,
}) {

    /* -----------------------------
       Build Running Balance
    ----------------------------- */
    let runningBalance = 0;

    const chartData =
        [...activity]
            .reverse()
            .map((item, index) => {

                if (
                    item.type ===
                    "deposit"
                ) {
                    runningBalance +=
                        item.amount;
                }

                if (
                    item.type ===
                    "withdraw"
                ) {
                    runningBalance -=
                        item.amount;
                }

                return {
                    step: index + 1,

                    balance:
                        runningBalance,

                    type:
                        item.type,
                };
            });

    return (
        <div className="form-panel h-[300px] p-4 sm:p-6">

            <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        stroke="#1a1f2e"
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="step"
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
                        dx={-10}
                        tickFormatter={(value) => value.toLocaleString()}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0b101c",
                            border: "1px solid rgba(255,215,0,0.1)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                            fontFamily: "'Inter', sans-serif"
                        }}
                        itemStyle={{ color: "#fbbf24", fontWeight: "bold" }}
                        labelStyle={{ color: "#94a3b8" }}
                    />

                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#fbbf24"
                        fill="url(#goldGradient)"
                        strokeWidth={3}
                        animationDuration={1500}
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>
    );
}

export default PocketPerformanceChart;