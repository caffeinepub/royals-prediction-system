import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Newspaper } from "lucide-react";
import type { NewsItem } from "../backend.d";

interface MandiNewsProps {
  news: NewsItem[];
}

function timeAgo(timestamp: bigint): string {
  const now = Date.now();
  const ts = Number(timestamp);
  const diffMs = now - ts;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}

export function MandiNews({ news }: MandiNewsProps) {
  const sorted = [...news].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card h-full">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Recent Mandi News
        </h3>
      </div>

      <ScrollArea className="h-52">
        {sorted.length === 0 ? (
          <div
            className="flex items-center justify-center h-32"
            data-ocid="news.empty_state"
          >
            <p className="text-xs text-muted-foreground">No news available</p>
          </div>
        ) : (
          <div className="space-y-3 pr-3">
            {sorted.slice(0, 10).map((item, i) => (
              <div
                key={`${item.market}-${item.timestamp}-${i}`}
                data-ocid={`news.item.${i + 1}`}
                className="pb-3 border-b border-border last:border-0"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-foreground leading-tight flex-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {item.content}
                </p>
                <span className="inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">
                  {item.market}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
