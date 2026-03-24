import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  Crown,
  MapPin,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";

export function Header() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { to: "/", label: "Dashboard", icon: BarChart2 },
    { to: "/commodities", label: "Commodities", icon: ShoppingBasket },
    { to: "/markets", label: "Markets", icon: MapPin },
    { to: "/analysis", label: "Analysis", icon: TrendingUp },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: "oklch(var(--header-bg))" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent/30">
            <Crown className="w-4 h-4 text-accent" />
          </div>
          <div className="leading-none">
            <span className="font-bold text-base tracking-wider text-accent block">
              ROYAL'S
            </span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Prediction System
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Prices
          </div>
        </div>
      </div>
    </header>
  );
}
