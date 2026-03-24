import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAllCommodities,
  useAllMarkets,
  usePriceHistory,
} from "../hooks/useQueries";
import { predictPrices } from "../utils/predictions";

export function AnalysisPage() {
  const [days, setDays] = useState(30);
  const { data: commodities = [] } = useAllCommodities();
  const { data: markets = [] } = useAllMarkets();
  const [market, setMarket] = useState("");

  const effectiveMarket = market || markets[0]?.name || "";

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Price Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comparative analysis across commodities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={effectiveMarket} onValueChange={setMarket}>
            <SelectTrigger
              className="w-44 bg-card border-border text-sm"
              data-ocid="analysis.select"
            >
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {markets.map((m) => (
                <SelectItem key={m.name} value={m.name}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                data-ocid="analysis.toggle"
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  days === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      <PriceComparisonChart
        commodities={commodities.slice(0, 8).map((c) => c.name)}
        market={effectiveMarket}
        days={days}
      />
    </main>
  );
}

function PriceComparisonChart({
  commodities,
  market,
  days,
}: {
  commodities: string[];
  market: string;
  days: number;
}) {
  const { data: r0 = [] } = usePriceHistory(commodities[0] || "", market, days);
  const { data: r1 = [] } = usePriceHistory(commodities[1] || "", market, days);
  const { data: r2 = [] } = usePriceHistory(commodities[2] || "", market, days);
  const { data: r3 = [] } = usePriceHistory(commodities[3] || "", market, days);
  const { data: r4 = [] } = usePriceHistory(commodities[4] || "", market, days);
  const { data: r5 = [] } = usePriceHistory(commodities[5] || "", market, days);
  const { data: r6 = [] } = usePriceHistory(commodities[6] || "", market, days);
  const { data: r7 = [] } = usePriceHistory(commodities[7] || "", market, days);

  const data = useMemo(() => {
    const records = [r0, r1, r2, r3, r4, r5, r6, r7];
    return commodities
      .map((name, i) => {
        const pred = predictPrices(records[i], 7);
        return {
          name: name.slice(0, 10),
          current: pred.currentPrice,
          predicted:
            pred.currentPrice +
            (pred.currentPrice * pred.predictedChange) / 100,
          change: pred.predictedChange,
        };
      })
      .filter((d) => d.current > 0);
  }, [r0, r1, r2, r3, r4, r5, r6, r7, commodities]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 text-xs shadow-card">
        <p className="text-foreground font-medium mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.fill }}
            />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="text-foreground font-semibold">
              ₹{p.value?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border border-border p-6 shadow-card"
    >
      <h2 className="text-base font-semibold text-foreground mb-5">
        Current vs Predicted Prices (₹/unit)
      </h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.30 0.012 240)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "oklch(0.77 0.01 240)", fontSize: 11 }}
            axisLine={{ stroke: "oklch(0.30 0.012 240)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.77 0.01 240)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill="#1BAA95" opacity={0.8} />
            ))}
          </Bar>
          <Bar dataKey="predicted" name="Predicted" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={`pred-${entry.name}`}
                fill={entry.change >= 0 ? "#D1A545" : "#D85C5C"}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
