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
        <div
            className="
        h-[300px]
        bg-[#111827]
        rounded-2xl
        p-4
      "
        >

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <AreaChart
                    data={chartData}
                >

                    <CartesianGrid
                        stroke="#334155"
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="step"
                        stroke="#94a3b8"
                    />

                    <YAxis
                        stroke="#94a3b8"
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor:
                                "#0f172a",
                            border:
                                "none",
                            borderRadius:
                                "16px",
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#a855f7"
                        fill="#7e22ce"
                        strokeWidth={4}
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>
    );
}

export default PocketPerformanceChart;