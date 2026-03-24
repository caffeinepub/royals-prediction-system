import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { Commodity, PriceRecord } from "../backend.d";
import type { PredictionResult } from "../utils/predictions";

interface CommodityCardProps {
  commodity: Commodity;
  priceHistory: PriceRecord[];
  prediction: PredictionResult;
  index: number;
  lang: "en" | "hi" | "mr";
}

const confidenceColors = {
  High: "text-primary bg-primary/10 border-primary/20",
  Medium: "text-accent bg-accent/10 border-accent/20",
  Low: "text-destructive bg-destructive/10 border-destructive/20",
};

export function CommodityCard({
  commodity,
  priceHistory,
  prediction,
  index,
  lang,
}: CommodityCardProps) {
  const displayName =
    lang === "hi"
      ? commodity.hindiName
      : lang === "mr"
        ? commodity.marathiName
        : commodity.name;

  const sparkData = priceHistory
    .slice(-14)
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map((r, i) => ({ i, price: r.price }));

  const lineColor =
    prediction.trend === "up"
      ? "#1BAA95"
      : prediction.trend === "down"
        ? "#D85C5C"
        : "#D9B35A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-lg border border-border shadow-card hover:border-primary/40 transition-all group"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{commodity.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-tight">
                {displayName}
              </h3>
              {lang !== "en" && (
                <p className="text-xs text-muted-foreground">
                  {commodity.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground capitalize">
                {commodity.category}
              </p>
            </div>
          </div>
          <Badge
            className={`text-[10px] border ${confidenceColors[prediction.confidence]}`}
            variant="outline"
          >
            {prediction.confidence}
          </Badge>
        </div>

        {/* Sparkline */}
        <div className="h-14 -mx-1 mb-3">
          {sparkData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={lineColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No data</span>
            </div>
          )}
        </div>

        {/* Price + Prediction */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">
              Current Price
            </p>
            <p className="text-lg font-semibold text-foreground">
              ₹{prediction.currentPrice.toFixed(2)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                /{commodity.unit}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">
              7-Day Forecast
            </p>
            <div className="flex items-center gap-1 justify-end">
              {prediction.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              ) : prediction.trend === "down" ? (
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-accent" />
              )}
              <span
                className={`text-sm font-semibold ${
                  prediction.trend === "up"
                    ? "text-primary"
                    : prediction.trend === "down"
                      ? "text-destructive"
                      : "text-accent"
                }`}
              >
                {prediction.predictedChange >= 0 ? "+" : ""}
                {prediction.predictedChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Link
          to="/commodity/$name"
          params={{ name: commodity.name }}
          data-ocid={`commodity.button.${index + 1}`}
          className="flex items-center justify-center w-full py-2 rounded text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}
