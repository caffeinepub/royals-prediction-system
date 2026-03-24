import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PriceRecord } from "../backend.d";
import { formatDate } from "../utils/predictions";

interface PriceTrendChartProps {
  records1: PriceRecord[];
  records2: PriceRecord[];
  label1: string;
  label2: string;
}

export function PriceTrendChart({
  records1,
  records2,
  label1,
  label2,
}: PriceTrendChartProps) {
  const dateMap = new Map<
    string,
    { date: string; price1?: number; price2?: number }
  >();

  for (const r of [...records1].sort(
    (a, b) => Number(a.date) - Number(b.date),
  )) {
    const key = formatDate(r.date);
    const existing = dateMap.get(key) || { date: key };
    existing.price1 = r.price;
    dateMap.set(key, existing);
  }

  for (const r of [...records2].sort(
    (a, b) => Number(a.date) - Number(b.date),
  )) {
    const key = formatDate(r.date);
    const existing = dateMap.get(key) || { date: key };
    existing.price2 = r.price;
    dateMap.set(key, existing);
  }

  const data = Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 text-xs shadow-card">
        <p className="text-muted-foreground mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
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
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
        <Legend
          wrapperStyle={{
            fontSize: 12,
            color: "oklch(0.77 0.01 240)",
            paddingTop: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="price1"
          name={label1}
          stroke="#1BAA95"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="price2"
          name={label2}
          stroke="#D1A545"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
