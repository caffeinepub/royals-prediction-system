import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCommodity, usePriceHistory } from "../hooks/useQueries";
import { useAllMarkets } from "../hooks/useQueries";
import { formatDate, predictPrices } from "../utils/predictions";

export function CommodityDetail() {
  const params = useParams({ from: "/commodity/$name" });
  const name = params.name;
  const [days, setDays] = useState(30);

  const { data: commodity, isLoading: loadingCommodity } = useCommodity(name);
  const { data: markets = [] } = useAllMarkets();
  const [selectedMarket, setSelectedMarket] = useState("");

  const market = selectedMarket || markets[0]?.name || "";
  const { data: history = [], isLoading: loadingHistory } = usePriceHistory(
    name,
    market,
    days,
  );

  const prediction = useMemo(() => predictPrices(history, 30), [history]);

  const chartData = useMemo(() => {
    const historical = history
      .sort((a, b) => Number(a.date) - Number(b.date))
      .map((r) => ({
        date: formatDate(r.date),
        price: r.price,
        predicted: undefined as number | undefined,
      }));

    const future = prediction.predictedPrices.map((p) => ({
      date: p.date,
      price: undefined as number | undefined,
      predicted: p.price,
    }));

    return [...historical, ...future];
  }, [history, prediction]);

  const isLoading = loadingCommodity || loadingHistory;

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="commodity_detail.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!commodity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Commodity not found</p>
      </div>
    );
  }

  const TrendIcon =
    prediction.trend === "up"
      ? TrendingUp
      : prediction.trend === "down"
        ? TrendingDown
        : Minus;
  const trendColor =
    prediction.trend === "up"
      ? "text-primary"
      : prediction.trend === "down"
        ? "text-destructive"
        : "text-accent";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 text-xs shadow-card">
        <p className="text-muted-foreground mb-2">{label}</p>
        {payload.map((p: any) =>
          p.value != null ? (
            <div key={p.dataKey} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: p.color }}
              />
              <span className="text-muted-foreground">{p.name}:</span>
              <span className="text-foreground font-semibold">
                ₹{p.value?.toFixed(2)}
              </span>
            </div>
          ) : null,
        )}
      </div>
    );
  };

  const statsGrid = [
    {
      label: "Current Price",
      value: `₹${prediction.currentPrice.toFixed(2)}`,
      unit: `/${commodity.unit}`,
      color: "text-foreground",
    },
    {
      label: "7-Day Avg",
      value: `₹${prediction.avg7d.toFixed(2)}`,
      unit: `/${commodity.unit}`,
      color: "text-foreground",
    },
    {
      label: "30-Day Avg",
      value: `₹${prediction.avg30d.toFixed(2)}`,
      unit: `/${commodity.unit}`,
      color: "text-foreground",
    },
    {
      label: "Min Price",
      value: `₹${prediction.minPrice.toFixed(2)}`,
      unit: `/${commodity.unit}`,
      color: "text-primary",
    },
    {
      label: "Max Price",
      value: `₹${prediction.maxPrice.toFixed(2)}`,
      unit: `/${commodity.unit}`,
      color: "text-destructive",
    },
    {
      label: "7D Forecast",
      value: `${prediction.predictedChange >= 0 ? "+" : ""}${prediction.predictedChange}%`,
      unit: "",
      color:
        prediction.trend === "up"
          ? "text-primary"
          : prediction.trend === "down"
            ? "text-destructive"
            : "text-accent",
    },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          to="/"
          data-ocid="commodity_detail.link"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{commodity.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {commodity.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">
                हिंदी:{" "}
                <span className="text-foreground">{commodity.hindiName}</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                मराठी:{" "}
                <span className="text-foreground">{commodity.marathiName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary bg-primary/10"
              >
                {commodity.category}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs border-border ${
                  prediction.confidence === "High"
                    ? "text-primary bg-primary/10 border-primary/30"
                    : prediction.confidence === "Medium"
                      ? "text-accent bg-accent/10 border-accent/30"
                      : "text-destructive bg-destructive/10 border-destructive/30"
                }`}
              >
                {prediction.confidence} Confidence
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={market} onValueChange={setSelectedMarket}>
            <SelectTrigger
              className="w-44 bg-card border-border text-sm"
              data-ocid="commodity_detail.select"
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
            {[30, 90].map((d) => (
              <button
                key={d}
                type="button"
                data-ocid="commodity_detail.toggle"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        {statsGrid.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-4 text-center"
          >
            <p className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-xs font-normal text-muted-foreground">
                {stat.unit}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg border border-border p-6 shadow-card mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">
            Price History & Predictions
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-[#1BAA95]" />
              <span className="text-muted-foreground">Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-[#D1A545]" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.30 0.012 240)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "oklch(0.77 0.01 240)", fontSize: 11 }}
              axisLine={{ stroke: "oklch(0.30 0.012 240)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "oklch(0.77 0.01 240)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            {history.length > 0 && (
              <ReferenceLine
                x={formatDate(
                  history.sort((a, b) => Number(b.date) - Number(a.date))[0]
                    ?.date || 0n,
                )}
                stroke="oklch(0.77 0.01 240)"
                strokeDasharray="4 4"
                label={{
                  value: "Today",
                  fill: "oklch(0.77 0.01 240)",
                  fontSize: 10,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="price"
              name="Historical"
              stroke="#1BAA95"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              stroke="#D1A545"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg border border-border p-6 shadow-card"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">
          Trend Analysis
        </h2>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-secondary ${trendColor}`}
          >
            <TrendIcon className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-lg font-bold capitalize ${trendColor}`}>
              {prediction.trend === "up"
                ? "Upward Trend"
                : prediction.trend === "down"
                  ? "Downward Trend"
                  : "Stable / Sideways"}
            </p>
            <p className="text-sm text-muted-foreground">
              Based on {Math.min(history.length, 14)}-day moving average.
              Forecast confidence:{" "}
              <span className="text-foreground font-medium">
                {prediction.confidence}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
