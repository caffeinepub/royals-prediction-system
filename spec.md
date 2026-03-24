# Royal's Prediction System

## Current State
New project -- no existing application.

## Requested Changes (Diff)

### Add
- Full-stack agri-horticultural commodity price prediction system
- Motoko backend storing commodities, historical price data, mandi/market data, and news items
- Statistical price prediction engine (moving average + seasonal trend analysis)
- Dashboard with commodity cards, price trend charts, market sentiment, and mandi news
- Dedicated commodity detail pages
- Filters by region, market/mandi, and timeframe
- Commodity comparison view
- Dark theme throughout

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. **Backend**: Define data types for Commodity, PriceRecord, Market, NewsItem. Seed mock historical price data for 10+ commodities. Expose APIs to query commodities, price history, predictions (moving average), markets, and news.
2. **Frontend**:
   - App shell with dark theme, header nav (Dashboard, Commodities, Markets, Analysis, Reports), and footer
   - Dashboard page: hero section, filters sidebar, commodity cards grid, price trend chart, market sentiment gauge, mandi news list
   - Commodity detail page: full price history chart, prediction chart, stats
   - Use Recharts for all chart visualizations
   - Multi-language commodity names (English / Hindi / Marathi labels)
