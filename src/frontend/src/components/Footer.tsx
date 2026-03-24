import { Crown, TrendingUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="border-t border-border mt-16"
      style={{ background: "oklch(var(--header-bg))" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-accent" />
              <span className="font-bold text-accent tracking-wider">
                ROYAL'S
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-driven price intelligence for farmers, traders, and market
              officials.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Price Prediction</li>
              <li>Market Analysis</li>
              <li>Trend Charts</li>
              <li>Mandi News</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Commodities
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Vegetables</li>
              <li>Fruits</li>
              <li>Grains</li>
              <li>Spices</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Languages
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>English</li>
              <li>हिंदी (Hindi)</li>
              <li>मराठी (Marathi)</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>Royal's Prediction System — Empowering Farmers with AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
