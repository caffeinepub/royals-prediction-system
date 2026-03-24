import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CommodityCard } from "../components/CommodityCard";
import {
  useAllCommodities,
  useAllMarkets,
  usePriceHistory,
} from "../hooks/useQueries";
import { predictPrices } from "../utils/predictions";

type LangKey = "en" | "hi" | "mr";

export function CommoditiesPage() {
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<LangKey>("en");
  const { data: commodities = [] } = useAllCommodities();
  const { data: markets = [] } = useAllMarkets();
  const market = markets[0]?.name || "";

  const filtered = useMemo(
    () =>
      commodities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.hindiName.includes(search) ||
          c.marathiName.includes(search),
      ),
    [commodities, search],
  );

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">All Commodities</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="commodities.search_input"
              className="pl-9 w-52 bg-card border-border text-sm"
            />
          </div>
          {(["en", "hi", "mr"] as LangKey[]).map((k) => (
            <button
              key={k}
              type="button"
              data-ocid="lang.toggle"
              onClick={() => setLang(k)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                lang === k
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "en" ? "EN" : k === "hi" ? "हि" : "म"}
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="commodity.list"
      >
        {filtered.map((commodity, i) => (
          <CommodityCardLoader
            key={commodity.name}
            commodity={commodity}
            market={market}
            days={30}
            index={i}
            lang={lang}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="commodity.empty_state"
        >
          <p className="text-muted-foreground text-sm">No commodities found</p>
        </div>
      )}
    </main>
  );
}

function CommodityCardLoader({
  commodity,
  market,
  days,
  index,
  lang,
}: {
  commodity: {
    name: string;
    unit: string;
    marathiName: string;
    emoji: string;
    hindiName: string;
    category: string;
  };
  market: string;
  days: number;
  index: number;
  lang: LangKey;
}) {
  const { data: history = [] } = usePriceHistory(commodity.name, market, days);
  const prediction = useMemo(() => predictPrices(history, 7), [history]);

  return (
    <CommodityCard
      commodity={commodity}
      priceHistory={history}
      prediction={prediction}
      index={index}
      lang={lang}
    />
  );
}
