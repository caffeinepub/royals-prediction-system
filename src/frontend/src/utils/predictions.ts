import type { PriceRecord } from "../backend.d";

export interface PredictionResult {
  currentPrice: number;
  predictedChange: number;
  confidence: "High" | "Medium" | "Low";
  trend: "up" | "down" | "neutral";
  avg7d: number;
  avg30d: number;
  minPrice: number;
  maxPrice: number;
  predictedPrices: Array<{ date: string; price: number }>;
}

export function computeMovingAverage(
  prices: number[],
  window: number,
): number[] {
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = prices.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

export function predictPrices(
  records: PriceRecord[],
  daysForward: number,
): PredictionResult {
  if (!records || records.length === 0) {
    return {
      currentPrice: 0,
      predictedChange: 0,
      confidence: "Low",
      trend: "neutral",
      avg7d: 0,
      avg30d: 0,
      minPrice: 0,
      maxPrice: 0,
      predictedPrices: [],
    };
  }

  const sorted = [...records].sort((a, b) => Number(a.date) - Number(b.date));
  const prices = sorted.map((r) => r.price);
  const currentPrice = prices[prices.length - 1];

  const last7 = prices.slice(-7);
  const last30 = prices.slice(-30);
  const last14 = prices.slice(-14);

  const avg7d = last7.reduce((a, b) => a + b, 0) / last7.length;
  const avg30d =
    last30.length > 0
      ? last30.reduce((a, b) => a + b, 0) / last30.length
      : avg7d;

  const mean = avg7d;
  const variance =
    last7.reduce((acc, p) => acc + (p - mean) ** 2, 0) / last7.length;
  const stdDev = Math.sqrt(variance);
  const coeffOfVariation = mean > 0 ? (stdDev / mean) * 100 : 0;

  let confidence: "High" | "Medium" | "Low";
  if (coeffOfVariation < 5) confidence = "High";
  else if (coeffOfVariation < 12) confidence = "Medium";
  else confidence = "Low";

  const ma = computeMovingAverage(last14, 7);
  const maSlope =
    ma.length >= 2 ? (ma[ma.length - 1] - ma[0]) / (ma.length - 1) : 0;
  const predictedChange =
    avg7d > 0
      ? ((currentPrice + maSlope * 7 - currentPrice) / currentPrice) * 100
      : 0;
  const trend = maSlope > 0.3 ? "up" : maSlope < -0.3 ? "down" : "neutral";

  const predictedPrices: Array<{ date: string; price: number }> = [];
  const lastDate = new Date(Number(sorted[sorted.length - 1].date));

  for (let i = 1; i <= daysForward; i++) {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i);
    const predictedPrice = Math.max(0, currentPrice + maSlope * i);
    predictedPrices.push({
      date: d.toISOString().split("T")[0],
      price: Math.round(predictedPrice * 100) / 100,
    });
  }

  return {
    currentPrice,
    predictedChange: Math.round(predictedChange * 10) / 10,
    confidence,
    trend,
    avg7d: Math.round(avg7d * 100) / 100,
    avg30d: Math.round(avg30d * 100) / 100,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    predictedPrices,
  };
}

export function computeMarketSentiment(
  allPriceRecords: Map<string, PriceRecord[]>,
): {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  score: number;
  label: string;
} {
  let totalSlope = 0;
  let count = 0;

  for (const records of allPriceRecords.values()) {
    if (records.length < 2) continue;
    const sorted = [...records].sort((a, b) => Number(a.date) - Number(b.date));
    const last7 = sorted.slice(-7).map((r) => r.price);
    if (last7.length < 2) continue;
    const slope = (last7[last7.length - 1] - last7[0]) / (last7.length - 1);
    totalSlope += slope;
    count++;
  }

  if (count === 0) return { sentiment: "Neutral", score: 50, label: "Neutral" };

  const avgSlope = totalSlope / count;
  if (avgSlope > 0.5)
    return {
      sentiment: "Bullish",
      score: Math.min(80, 55 + avgSlope * 5),
      label: "Bullish",
    };
  if (avgSlope < -0.5)
    return {
      sentiment: "Bearish",
      score: Math.max(20, 45 + avgSlope * 5),
      label: "Bearish",
    };
  return { sentiment: "Neutral", score: 50, label: "Neutral" };
}

export function formatDate(timestamp: bigint): string {
  const d = new Date(Number(timestamp));
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
