import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import type { Market } from "../backend.d";

interface FiltersPanelProps {
  markets: Market[];
  selectedRegion: string;
  selectedMarket: string;
  selectedDays: number;
  onRegionChange: (v: string) => void;
  onMarketChange: (v: string) => void;
  onDaysChange: (v: number) => void;
}

export function FiltersPanel({
  markets,
  selectedRegion,
  selectedMarket,
  selectedDays,
  onRegionChange,
  onMarketChange,
  onDaysChange,
}: FiltersPanelProps) {
  const regions = Array.from(new Set(markets.map((m) => m.region))).filter(
    Boolean,
  );
  const filteredMarkets =
    selectedRegion && selectedRegion !== "all"
      ? markets.filter((m) => m.region === selectedRegion)
      : markets;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-card rounded-lg border border-border p-5 shadow-card sticky top-20">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Region
            </p>
            <Select value={selectedRegion} onValueChange={onRegionChange}>
              <SelectTrigger
                className="bg-secondary border-border text-sm"
                data-ocid="filters.select"
              >
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Market / Mandi
            </p>
            <Select value={selectedMarket} onValueChange={onMarketChange}>
              <SelectTrigger
                className="bg-secondary border-border text-sm"
                data-ocid="filters.select"
              >
                <SelectValue placeholder="All Markets" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Markets</SelectItem>
                {filteredMarkets.map((m) => (
                  <SelectItem key={m.name} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Timeframe
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  data-ocid="filters.toggle"
                  onClick={() => onDaysChange(d)}
                  className={`py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedDays === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Confidence
            </p>
            <div className="space-y-2">
              {[
                { label: "High", color: "bg-primary" },
                { label: "Medium", color: "bg-accent" },
                { label: "Low", color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
