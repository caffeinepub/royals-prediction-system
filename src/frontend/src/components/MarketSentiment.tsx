import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface MarketSentimentProps {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  score: number;
  market: string;
}

export function MarketSentiment({
  sentiment,
  score,
  market,
}: MarketSentimentProps) {
  const color =
    sentiment === "Bullish"
      ? "#1BAA95"
      : sentiment === "Bearish"
        ? "#D85C5C"
        : "#D9B35A";

  const Icon =
    sentiment === "Bullish"
      ? TrendingUp
      : sentiment === "Bearish"
        ? TrendingDown
        : Minus;

  const data = [{ value: score, fill: color }];

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card h-full">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Market Sentiment
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        {market || "All Markets"}
      </p>

      <div className="relative h-36 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="90%"
            innerRadius="60%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={data}
          >
            <RadialBar
              background={{ fill: "oklch(0.27 0.012 240)" }}
              dataKey="value"
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-2 flex flex-col items-center">
          <Icon className="w-5 h-5 mb-1" style={{ color }} />
          <span className="text-lg font-bold" style={{ color }}>
            {sentiment}
          </span>
          <span className="text-xs text-muted-foreground">
            {score.toFixed(0)}% confidence
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Bullish", color: "#1BAA95" },
          { label: "Neutral", color: "#D9B35A" },
          { label: "Bearish", color: "#D85C5C" },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center py-2 rounded text-xs ${
              sentiment === item.label ? "bg-secondary" : ""
            }`}
          >
            <div
              className="w-2 h-2 rounded-full mb-1"
              style={{ background: item.color }}
            />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
