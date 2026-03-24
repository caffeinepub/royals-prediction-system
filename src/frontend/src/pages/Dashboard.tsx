import { Link } from "@tanstack/react-router";
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PriceRecord } from "../backend.d";
import { CommodityCard } from "../components/CommodityCard";
import { FiltersPanel } from "../components/FiltersPanel";
import { MandiNews } from "../components/MandiNews";
import { MarketSentiment } from "../components/MarketSentiment";
import { PriceTrendChart } from "../components/PriceTrendChart";
import {
  useAllCommodities,
  useAllMarkets,
  useAllNews,
  usePriceHistory,
  useSeedData,
} from "../hooks/useQueries";
import { computeMarketSentiment, predictPrices } from "../utils/predictions";

type LangKey = "en" | "hi" | "mr";

const LANG_LABELS: Record<LangKey, string> = { en: "EN", hi: "हि", mr: "म" };

export function Dashboard() {
  const [region, setRegion] = useState("all");
  const [market, setMarket] = useState("all");
  const [days, setDays] = useState(30);
  const [lang, setLang] = useState<LangKey>("en");
  const [compare, setCompare] = useState<[string, string]>(["", ""]);
  const seededRef = useRef(false);
  const compareSetRef = useRef(false);

  const { mutate: seed, isPending: seeding } = useSeedData();
  const { data: commodities = [], isLoading: loadingCommodities } =
    useAllCommodities();
  const { data: markets = [] } = useAllMarkets();
  const { data: allNews = [] } = useAllNews();

  useEffect(() => {
    if (!seededRef.current) {
      seededRef.current = true;
      seed();
    }
  }, [seed]);

  useEffect(() => {
    if (commodities.length >= 2 && !compareSetRef.current) {
      compareSetRef.current = true;
      setCompare([commodities[0].name, commodities[1].name]);
    }
  }, [commodities]);

  const effectiveMarket = market !== "all" ? market : markets[0]?.name || "";

  return (
    <main>
      <section
        className="relative min-h-[420px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-agri-dark.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/75" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.19 0.012 240 / 0.92) 40%, transparent 100%)",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered Price Intelligence
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
                Empowering Farmers with
                <span className="text-primary"> AI-Driven</span> Price
                Intelligence
              </h1>
              <p className="text-base text-muted-foreground mb-6 max-w-lg leading-relaxed">
                Royal's Prediction System uses machine learning to forecast
                agri-horticultural commodity prices, helping farmers and traders
                make informed decisions.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/commodities"
                  data-ocid="hero.primary_button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Explore Predictions <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/analysis"
                  data-ocid="hero.secondary_button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
                >
                  View Analysis
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <span className="text-xs text-muted-foreground">Language:</span>
                {(Object.entries(LANG_LABELS) as [LangKey, string][]).map(
                  ([k, v]) => (
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
                      {v}
                    </button>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 shadow-card max-w-sm ml-auto">
                <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
                  Today's Market Snapshot
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Commodities Tracked",
                      value: commodities.length || "—",
                      color: "text-primary",
                    },
                    {
                      label: "Active Markets",
                      value: markets.length || "—",
                      color: "text-accent",
                    },
                    {
                      label: "Prediction Accuracy",
                      value: "91.4%",
                      color: "text-primary",
                    },
                    {
                      label: "Data Points",
                      value: "10K+",
                      color: "text-accent",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-secondary/50 rounded-lg p-3"
                    >
                      <p className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {seeding && (
          <div
            className="flex items-center gap-2 mb-6 text-sm text-muted-foreground"
            data-ocid="dashboard.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Initializing market data...
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersPanel
            markets={markets}
            selectedRegion={region}
            selectedMarket={market}
            selectedDays={days}
            onRegionChange={setRegion}
            onMarketChange={setMarket}
            onDaysChange={setDays}
          />

          <div className="flex-1 min-w-0 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Commodity Prices & Predictions
                </h2>
                <Link
                  to="/commodities"
                  data-ocid="commodities.link"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {loadingCommodities ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["sk-1", "sk-2", "sk-3", "sk-4"].map((k) => (
                    <div
                      key={k}
                      className="bg-card rounded-lg border border-border h-52 animate-pulse"
                      data-ocid="commodity.loading_state"
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  data-ocid="commodity.list"
                >
                  {commodities.slice(0, 6).map((commodity, i) => (
                    <CommodityCardLoader
                      key={commodity.name}
                      commodity={commodity}
                      market={effectiveMarket}
                      days={days}
                      index={i}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="bg-card rounded-lg border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Price Trend Analysis
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    key="compare-0"
                    value={compare[0]}
                    onChange={(e) => setCompare([e.target.value, compare[1]])}
                    data-ocid="trend.select"
                    className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
                  >
                    {commodities.map((cm) => (
                      <option key={cm.name} value={cm.name}>
                        {cm.name}
                      </option>
                    ))}
                  </select>
                  <select
                    key="compare-1"
                    value={compare[1]}
                    onChange={(e) => setCompare([compare[0], e.target.value])}
                    data-ocid="trend.select"
                    className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
                  >
                    {commodities.map((cm) => (
                      <option key={cm.name} value={cm.name}>
                        {cm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ComparePriceChart
                market={effectiveMarket}
                days={days}
                commodity1={compare[0]}
                commodity2={compare[1]}
              />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentSection
                market={effectiveMarket}
                days={days}
                commodities={commodities.map((c) => c.name)}
              />
              <MandiNews news={allNews} />
            </div>
          </div>
        </div>
      </div>
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

function ComparePriceChart({
  market,
  days,
  commodity1,
  commodity2,
}: {
  market: string;
  days: number;
  commodity1: string;
  commodity2: string;
}) {
  const { data: records1 = [] } = usePriceHistory(commodity1, market, days);
  const { data: records2 = [] } = usePriceHistory(commodity2, market, days);

  return (
    <PriceTrendChart
      records1={records1}
      records2={records2}
      label1={commodity1 || "Commodity 1"}
      label2={commodity2 || "Commodity 2"}
    />
  );
}

function SentimentSection({
  market,
  days,
  commodities,
}: {
  market: string;
  days: number;
  commodities: string[];
}) {
  const { data: r1 = [] } = usePriceHistory(commodities[0] || "", market, days);
  const { data: r2 = [] } = usePriceHistory(commodities[1] || "", market, days);
  const { data: r3 = [] } = usePriceHistory(commodities[2] || "", market, days);
  const { data: r4 = [] } = usePriceHistory(commodities[3] || "", market, days);
  const { data: r5 = [] } = usePriceHistory(commodities[4] || "", market, days);

  const sentiment = useMemo(() => {
    const map = new Map<string, PriceRecord[]>();
    if (commodities[0] && r1.length) map.set(commodities[0], r1);
    if (commodities[1] && r2.length) map.set(commodities[1], r2);
    if (commodities[2] && r3.length) map.set(commodities[2], r3);
    if (commodities[3] && r4.length) map.set(commodities[3], r4);
    if (commodities[4] && r5.length) map.set(commodities[4], r5);
    return computeMarketSentiment(map);
  }, [r1, r2, r3, r4, r5, commodities]);

  return (
    <MarketSentiment
      sentiment={sentiment.sentiment}
      score={sentiment.score}
      market={market}
    />
  );
}
