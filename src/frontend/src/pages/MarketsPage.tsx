import { Building2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useAllMarkets } from "../hooks/useQueries";

export function MarketsPage() {
  const { data: markets = [], isLoading } = useAllMarkets();

  const byRegion = markets.reduce(
    (acc, m) => {
      if (!acc[m.region]) acc[m.region] = [];
      acc[m.region].push(m);
      return acc;
    },
    {} as Record<string, typeof markets>,
  );

  const skeletonKeys = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Markets & Mandis
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Browse agricultural markets across India
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonKeys.map((k) => (
            <div
              key={k}
              className="bg-card rounded-lg border border-border h-32 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byRegion).map(([region, mks], ri) => (
            <motion.div
              key={region}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ri * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  {region}
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({mks.length} markets)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mks.map((m, i) => (
                  <div
                    key={m.name}
                    data-ocid={`market.card.${i + 1}`}
                    className="bg-card rounded-lg border border-border p-5 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {m.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {m.state}
                        </p>
                        <p className="text-xs text-primary mt-1">{m.region}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {markets.length === 0 && !isLoading && (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="market.empty_state"
        >
          <p className="text-sm text-muted-foreground">No markets found</p>
        </div>
      )}
    </main>
  );
}
