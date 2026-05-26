import { useState } from "react";
import Sidebar from "../config/Sidebar";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  Utensils,
  Building2,
  Percent,
  PawPrint,
  ClipboardList,
  ShieldAlert,
  GitFork,
  Hammer,
} from "lucide-react";

// ─── Reusable input field ────────────────────────────────────────────────────
function SimInput({ label, placeholder, value, onChange, unit }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full bg-[#0b101c] border border-[rgba(251,191,36,0.1)] rounded-xl
            px-4 py-3 text-slate-200 placeholder-slate-600 text-sm
            focus:outline-none focus:border-[rgba(251,191,36,0.4)] focus:ring-1 focus:ring-[rgba(251,191,36,0.15)]
            transition-all duration-200
          "
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none select-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children }) {
  return (
    <div
      className="
        relative rounded-2xl overflow-hidden
        bg-[#03050a]/80 border border-[rgba(251,191,36,0.08)]
        p-6
      "
      style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
    >
      {/* subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.2)] to-transparent" />

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-[#fbbf24]/10 border border-[rgba(251,191,36,0.15)]">
          <Icon size={16} className="text-[#fbbf24]" />
        </div>
        <h2
          className="text-base font-semibold text-slate-200 tracking-wide"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {title}
        </h2>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ─── Result metric row ────────────────────────────────────────────────────────
function ResultMetric({ label, value, tone = "neutral", large = false, sublabel }) {
  const colorMap = {
    neutral: "text-slate-200",
    positive: "text-emerald-400",
    negative: "text-rose-400",
    amber: "text-[#fbbf24]",
  };

  const Icon =
    tone === "positive"
      ? TrendingUp
      : tone === "negative"
      ? TrendingDown
      : Minus;

  const iconColor =
    tone === "positive"
      ? "text-emerald-500"
      : tone === "negative"
      ? "text-rose-500"
      : "text-slate-600";

  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0">
      <div className="flex items-center gap-2">
        <Icon size={13} className={`${iconColor} shrink-0`} />
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            {label}
          </p>
          {sublabel && (
            <p className="text-[10px] text-slate-600 mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
      <span
        className={`
          font-bold tabular-nums
          ${large ? "text-3xl" : "text-xl"}
          ${colorMap[tone]}
        `}
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Confidence pill ──────────────────────────────────────────────────────────
function ConfidencePill({ rate }) {
  const label =
    rate >= 90 ? "High Confidence" : rate >= 70 ? "Moderate" : "High Risk";
  const cls =
    rate >= 90
      ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/40"
      : rate >= 70
      ? "bg-amber-900/30 text-amber-400 border-amber-800/40"
      : "bg-rose-900/30 text-rose-400 border-rose-800/40";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function ProductionPlanner() {

  // ── Strategy ──────────────────────────────────────────────────────
  // "sell_adult" → sell the raised animal directly
  // "craft_mount" → craft into a mount then sell
  const [strategy, setStrategy] = useState("craft_mount");
  const isCraftMount = strategy === "craft_mount";

  // ── Market Variables ──────────────────────────────────────────────
  const [babyPrice, setBabyPrice]             = useState("");
  const [adultPrice, setAdultPrice]           = useState("");  // sell_adult path
  const [mountPrice, setMountPrice]           = useState("");  // craft_mount path
  const [mountCraftingCost, setMountCraftingCost] = useState(""); // craft_mount only
  const [foodUnitPrice, setFoodUnitPrice]     = useState("");  // price of ONE food item
  const [foodPerAnimal, setFoodPerAnimal]     = useState("");  // units needed per animal

  // ── Infrastructure ────────────────────────────────────────────────
  const [islandCount, setIslandCount]     = useState("");
  const [kennelCount, setKennelCount]     = useState("");
  const [cycleDuration, setCycleDuration] = useState("");
  const [successRate, setSuccessRate]     = useState("85");   // default 85%

  // ── Simulation Calculations ───────────────────────────────────────

  // Core breeding simulation metric
  const expectedOutputs =
    Number(kennelCount || 0) * (Number(successRate || 0) / 100);

  // Strategy-branched revenue
  const grossRevenue = isCraftMount
    ? Number(mountPrice || 0) * expectedOutputs      // sell crafted mounts
    : Number(adultPrice || 0) * expectedOutputs;     // sell adult animals directly

  // Total food items consumed (anchored to realistic output, not raw kennels)
  const totalFoodNeeded =
    Number(foodPerAnimal || 0) * expectedOutputs;

  const foodCost =
    Number(foodUnitPrice || 0) * totalFoodNeeded;

  const investment =
    Number(babyPrice || 0) * Number(kennelCount || 0);

  // Crafting cost only applies when strategy = craft_mount
  const totalMountCraftingCost = isCraftMount
    ? Number(mountCraftingCost || 0) * expectedOutputs
    : 0;

  const netProfit = grossRevenue - foodCost - investment - totalMountCraftingCost;

  const roi =
    investment > 0 ? (netProfit / investment) * 100 : 0;

  const profitPerDay =
    Number(cycleDuration) > 0 ? netProfit / Number(cycleDuration) : 0;

  // Tone helpers
  const profitTone =
    netProfit === 0 ? "neutral" : netProfit > 0 ? "positive" : "negative";
  const roiTone =
    roi === 0 ? "neutral" : roi > 0 ? "positive" : "negative";
  const pdTone =
    profitPerDay === 0 ? "neutral" : profitPerDay > 0 ? "positive" : "negative";

  // Break-even: minimum sell price per output to recover all costs (strategy-aware)
  const totalCosts = foodCost + investment + totalMountCraftingCost;
  const breakEvenPrice =
    expectedOutputs > 0 ? totalCosts / expectedOutputs : 0;

  // Compare against the sell price for the active strategy
  const currentMarketPrice = isCraftMount
    ? Number(mountPrice || 0)
    : Number(adultPrice || 0);
  const marketAboveBreakEven =
    currentMarketPrice > 0 && breakEvenPrice > 0 && currentMarketPrice > breakEvenPrice;
  const marketBelowBreakEven =
    currentMarketPrice > 0 && breakEvenPrice > 0 && currentMarketPrice < breakEvenPrice;
  const marketAtBreakEven =
    currentMarketPrice > 0 && breakEvenPrice > 0 && currentMarketPrice === breakEvenPrice;

  // Safety margin: how much the current sell price exceeds break-even (%)
  const safetyMarginPct =
    breakEvenPrice > 0 && currentMarketPrice > 0
      ? ((currentMarketPrice - breakEvenPrice) / breakEvenPrice) * 100
      : null;

  const rateNum = Number(successRate || 0);

  return (
    <div className="flex min-h-screen bg-transparent font-[Inter]">
      <Sidebar />

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col pt-14 lg:pt-0 pb-16 lg:pb-0 overflow-y-auto">

        {/* ── Page header ── */}
        <div className="px-6 sm:px-10 pt-10 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#fbbf24]/10 border border-[rgba(251,191,36,0.2)]">
                  <ClipboardList size={20} className="text-[#fbbf24]" />
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Production Planner
                </h1>
              </div>
              <p className="text-slate-500 text-sm ml-1">
                Simulate realistic breeding operation profitability before committing capital.
              </p>
            </div>
            {/* Confidence pill driven by success rate */}
            <div className="mt-1">
              <ConfidencePill rate={rateNum} />
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="px-6 sm:px-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ─── LEFT: Inputs ──────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Market Variables */}
              <SectionCard icon={ShoppingCart} title="Market Variables">

                {/* ── Production Strategy selector ── */}
                <div className="pb-2 border-b border-[rgba(251,191,36,0.06)]">
                  <div className="flex items-center gap-2 mb-3">
                    <GitFork size={13} className="text-[#fbbf24]" />
                    <span className="text-[11px] uppercase tracking-widest text-[#fbbf24] font-semibold">
                      Production Strategy
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      className="
                        w-full bg-[#0b101c] border border-[rgba(251,191,36,0.1)] rounded-xl
                        px-4 py-3 text-slate-200 text-sm appearance-none cursor-pointer
                        focus:outline-none focus:border-[rgba(251,191,36,0.4)] focus:ring-1 focus:ring-[rgba(251,191,36,0.15)]
                        transition-all duration-200
                      "
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="sell_adult">Sell Adult Animal</option>
                      <option value="craft_mount">Craft Mount</option>
                    </select>
                    {/* chevron */}
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      ▾
                    </span>
                  </div>
                  {/* Strategy description badge */}
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111827]/60 border border-[rgba(255,255,255,0.04)]">
                    <span className="text-[10px] text-slate-500">
                      {isCraftMount
                        ? "Revenue = mount sell price × expected outputs. Includes crafting cost."
                        : "Revenue = adult animal price × expected outputs. Lower cost, faster cycle."}
                    </span>
                  </div>
                </div>

                {/* ── Prices: conditionally rendered per strategy ── */}
                <SimInput
                  label="Baby Animal Price"
                  placeholder="e.g. 15,000"
                  value={babyPrice}
                  onChange={setBabyPrice}
                  unit="silver"
                />

                {isCraftMount ? (
                  <>
                    <SimInput
                      label="Mount Sell Price"
                      placeholder="e.g. 120,000"
                      value={mountPrice}
                      onChange={setMountPrice}
                      unit="silver"
                    />
                    {/* Mount Crafting Cost — only for craft_mount */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Hammer size={11} className="text-rose-400" />
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Mount Crafting Cost
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="e.g. 5,000"
                          value={mountCraftingCost}
                          onChange={(e) => setMountCraftingCost(e.target.value)}
                          className="
                            w-full bg-[#0b101c] border border-[rgba(248,113,113,0.15)] rounded-xl
                            px-4 py-3 text-slate-200 placeholder-slate-600 text-sm
                            focus:outline-none focus:border-[rgba(248,113,113,0.4)] focus:ring-1 focus:ring-[rgba(248,113,113,0.1)]
                            transition-all duration-200
                          "
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none select-none">
                          silver
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <SimInput
                    label="Adult Animal Sell Price"
                    placeholder="e.g. 45,000"
                    value={adultPrice}
                    onChange={setAdultPrice}
                    unit="silver"
                  />
                )}

                {/* ── Food consumption modelling ── */}
                <div className="pt-2 border-t border-[rgba(251,191,36,0.06)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils size={13} className="text-[#fbbf24]" />
                    <span className="text-[11px] uppercase tracking-widest text-[#fbbf24] font-semibold">
                      Food Consumption
                    </span>
                  </div>
                  <div className="space-y-4">
                    <SimInput
                      label="Food Unit Price"
                      placeholder="e.g. 598"
                      value={foodUnitPrice}
                      onChange={setFoodUnitPrice}
                      unit="silver"
                    />
                    <SimInput
                      label="Food Required Per Animal"
                      placeholder="e.g. 93"
                      value={foodPerAnimal}
                      onChange={setFoodPerAnimal}
                      unit="units"
                    />
                    {/* Live food cost preview */}
                    {(Number(foodUnitPrice) > 0 || Number(foodPerAnimal) > 0) && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827]/60 border border-[rgba(255,255,255,0.04)]">
                        <span className="text-[10px] text-slate-600">
                          Cost per animal
                        </span>
                        <span className="text-xs font-semibold text-slate-400 tabular-nums">
                          {(Number(foodUnitPrice || 0) * Number(foodPerAnimal || 0)).toLocaleString()} silver
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Infrastructure Setup */}
              <SectionCard icon={Building2} title="Infrastructure Setup">
                <SimInput
                  label="Island Count"
                  placeholder="e.g. 3"
                  value={islandCount}
                  onChange={setIslandCount}
                />
                <SimInput
                  label="Kennel Count"
                  placeholder="e.g. 16"
                  value={kennelCount}
                  onChange={setKennelCount}
                />
                <SimInput
                  label="Cycle Duration"
                  placeholder="e.g. 3"
                  value={cycleDuration}
                  onChange={setCycleDuration}
                  unit="days"
                />

                {/* ── NEW: Breeding Success Rate ── */}
                <div className="pt-2 border-t border-[rgba(251,191,36,0.06)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent size={13} className="text-[#fbbf24]" />
                    <span className="text-[11px] uppercase tracking-widest text-[#fbbf24] font-semibold">
                      Breeding Simulation
                    </span>
                  </div>
                  <SimInput
                    label="Breeding Success Rate"
                    placeholder="Default: 85"
                    value={successRate}
                    onChange={setSuccessRate}
                    unit="%"
                  />
                  {/* Visual success rate bar */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-slate-600">0%</span>
                      <span className="text-[10px] text-slate-600">100%</span>
                    </div>
                    <div className="h-1.5 bg-[#111827] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, rateNum))}%`,
                          background:
                            rateNum >= 90
                              ? "linear-gradient(to right,#34d399,#10b981)"
                              : rateNum >= 70
                              ? "linear-gradient(to right,#fbbf24,#d97706)"
                              : "linear-gradient(to right,#f87171,#ef4444)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── RIGHT: Results ────────────────────────────────────── */}
            <div className="space-y-6">

              {/* ── Expected Outputs — hero card ── */}
              <div
                className="relative rounded-2xl overflow-hidden p-6 border"
                style={{
                  background: "linear-gradient(135deg,#0b101c 0%,#0f172a 100%)",
                  borderColor: "rgba(251,191,36,0.15)",
                  boxShadow: "0 4px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(251,191,36,0.06)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.3)] to-transparent" />
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/5 blur-[60px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#fbbf24]/10 border border-[rgba(251,191,36,0.2)]">
                    <PawPrint size={16} className="text-[#fbbf24]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                      Expected Outputs
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Kennels × Success Rate
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <span
                    className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#fbbf24] to-[#d97706] tabular-nums"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {expectedOutputs % 1 === 0
                      ? expectedOutputs.toLocaleString()
                      : expectedOutputs.toFixed(1)}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 mb-1">from</p>
                    <p className="text-sm font-semibold text-slate-400">
                      {Number(kennelCount || 0)} kennels
                    </p>
                    <p className="text-[11px] text-slate-600">
                      @ {rateNum}% rate
                    </p>
                  </div>
                </div>

                {/* Lost outputs indicator */}
                {Number(kennelCount) > 0 && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                    <p className="text-[11px] text-slate-600">
                      <span className="text-rose-500 font-semibold">
                        {(Number(kennelCount) - expectedOutputs).toFixed(1)}
                      </span>
                      {" "}expected breeding failures this cycle
                    </p>
                  </div>
                )}
              </div>

              {/* ── Production Results ── */}
              <SectionCard icon={Utensils} title="Production Results">
                <ResultMetric
                  label="Gross Revenue"
                  sublabel={
                    isCraftMount
                      ? "mount sell price × expected outputs"
                      : "adult sell price × expected outputs"
                  }
                  value={grossRevenue.toLocaleString()}
                  tone="neutral"
                />
                <ResultMetric
                  label="Total Food Needed"
                  sublabel="food per animal × expected outputs"
                  value={
                    totalFoodNeeded % 1 === 0
                      ? totalFoodNeeded.toLocaleString()
                      : totalFoodNeeded.toFixed(1)
                  }
                  tone="neutral"
                />
                <ResultMetric
                  label="Food Cost"
                  sublabel="unit price × total food needed"
                  value={foodCost.toLocaleString()}
                  tone={foodCost > 0 ? "negative" : "neutral"}
                />
                {isCraftMount && (
                  <ResultMetric
                    label="Mount Crafting Cost"
                    sublabel="crafting cost × expected outputs"
                    value={totalMountCraftingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    tone={totalMountCraftingCost > 0 ? "negative" : "neutral"}
                  />
                )}
                <ResultMetric
                  label="Investment"
                  sublabel="baby price × kennels"
                  value={investment.toLocaleString()}
                  tone="neutral"
                />
                <ResultMetric
                  label="Net Profit"
                  value={netProfit.toLocaleString()}
                  tone={profitTone}
                  large
                />
                <ResultMetric
                  label="ROI"
                  value={`${roi.toFixed(2)}%`}
                  tone={roiTone}
                />
                <ResultMetric
                  label="Profit Per Day"
                  value={profitPerDay.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  tone={pdTone}
                />
              </SectionCard>

              {/* ── Break-Even Analysis card ── */}
              <div
                className="relative rounded-2xl overflow-hidden p-6 border"
                style={{
                  background: "linear-gradient(135deg,#0c0e14 0%,#0f1420 100%)",
                  borderColor:
                    marketAboveBreakEven
                      ? "rgba(52,211,153,0.2)"
                      : marketBelowBreakEven
                      ? "rgba(248,113,113,0.2)"
                      : "rgba(251,191,36,0.15)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
                }}
              >
                {/* top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: marketAboveBreakEven
                      ? "linear-gradient(to right,transparent,rgba(52,211,153,0.4),transparent)"
                      : marketBelowBreakEven
                      ? "linear-gradient(to right,transparent,rgba(248,113,113,0.4),transparent)"
                      : "linear-gradient(to right,transparent,rgba(251,191,36,0.3),transparent)",
                  }}
                />

                {/* header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg border"
                      style={{
                        background: marketAboveBreakEven
                          ? "rgba(52,211,153,0.1)"
                          : marketBelowBreakEven
                          ? "rgba(248,113,113,0.1)"
                          : "rgba(251,191,36,0.1)",
                        borderColor: marketAboveBreakEven
                          ? "rgba(52,211,153,0.2)"
                          : marketBelowBreakEven
                          ? "rgba(248,113,113,0.2)"
                          : "rgba(251,191,36,0.2)",
                      }}
                    >
                      <ShieldAlert
                        size={16}
                        className={
                          marketAboveBreakEven
                            ? "text-emerald-400"
                            : marketBelowBreakEven
                            ? "text-rose-400"
                            : "text-[#fbbf24]"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                        Break-Even Analysis
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {isCraftMount
                          ? "(food + crafting + investment) ÷ expected outputs"
                          : "(food + investment) ÷ expected outputs"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Break-even price — the key number */}
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">
                      Min. Sell Price
                    </p>
                    <span
                      className="text-4xl font-bold tabular-nums text-yellow-500"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {breakEvenPrice > 0
                        ? Math.ceil(breakEvenPrice).toLocaleString()
                        : "—"}
                    </span>
                    <span className="text-xs text-slate-600 ml-2">silver</span>
                  </div>

                  {/* Safety margin badge */}
                  {safetyMarginPct !== null && (
                    <div
                      className="text-right px-3 py-2 rounded-xl border"
                      style={{
                        background: safetyMarginPct >= 0
                          ? "rgba(52,211,153,0.06)"
                          : "rgba(248,113,113,0.06)",
                        borderColor: safetyMarginPct >= 0
                          ? "rgba(52,211,153,0.15)"
                          : "rgba(248,113,113,0.15)",
                      }}
                    >
                      <p className="text-[10px] text-slate-600 mb-0.5">Safety margin</p>
                      <p
                        className={`text-lg font-bold tabular-nums ${
                          safetyMarginPct >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {safetyMarginPct >= 0 ? "+" : ""}{safetyMarginPct.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Market status indicator */}
                {currentMarketPrice > 0 && breakEvenPrice > 0 && (
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl border"
                    style={{
                      background: marketAboveBreakEven
                        ? "rgba(52,211,153,0.05)"
                        : marketBelowBreakEven
                        ? "rgba(248,113,113,0.05)"
                        : "rgba(251,191,36,0.05)",
                      borderColor: marketAboveBreakEven
                        ? "rgba(52,211,153,0.12)"
                        : marketBelowBreakEven
                        ? "rgba(248,113,113,0.12)"
                        : "rgba(251,191,36,0.12)",
                    }}
                  >
                    <span
                      className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        marketAboveBreakEven
                          ? "bg-emerald-400"
                          : marketBelowBreakEven
                          ? "bg-rose-400"
                          : "bg-yellow-400"
                      }`}
                      style={{ marginTop: "3px" }}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          marketAboveBreakEven
                            ? "text-emerald-400"
                            : marketBelowBreakEven
                            ? "text-rose-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {marketAboveBreakEven
                          ? "Current market price is profitable"
                          : marketBelowBreakEven
                          ? "Current market price is below break-even"
                          : "Current market price is exactly at break-even"}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {marketAboveBreakEven
                          ? `You need to sell above ${
                              Math.ceil(breakEvenPrice).toLocaleString()
                            } silver — current price covers costs by ${
                              (currentMarketPrice - Math.ceil(breakEvenPrice)).toLocaleString()
                            } silver per mount.`
                          : marketBelowBreakEven
                          ? `You are losing ${
                              (Math.ceil(breakEvenPrice) - currentMarketPrice).toLocaleString()
                            } silver per mount at current market price. Consider pausing production.`
                          : "You are covering costs exactly. Any market dip will result in a loss."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Prompt when inputs missing */}
                {(currentMarketPrice === 0 || breakEvenPrice === 0) && (
                  <p className="text-[11px] text-slate-600 text-center py-2">
                    Fill in market price, food cost, and investment to see break-even analysis.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductionPlanner;