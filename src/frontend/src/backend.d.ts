import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceRecord {
    date: bigint;
    market: string;
    price: number;
    commodity: string;
}
export interface Market {
    region: string;
    name: string;
    state: string;
}
export interface NewsItem {
    title: string;
    content: string;
    timestamp: bigint;
    market: string;
}
export interface Commodity {
    name: string;
    unit: string;
    marathiName: string;
    emoji: string;
    hindiName: string;
    category: string;
}
export interface backendInterface {
    addNewsItem(title: string, content: string, market: string): Promise<void>;
    addPriceRecord(commodity: string, market: string, price: number): Promise<void>;
    getAllCommodities(): Promise<Array<Commodity>>;
    getAllMarkets(): Promise<Array<Market>>;
    getAllNews(): Promise<Array<NewsItem>>;
    getCommodity(name: string): Promise<Commodity>;
    getMarket(name: string): Promise<Market>;
    getNewsForMarket(market: string): Promise<Array<NewsItem>>;
    getPriceHistory(commodity: string, market: string, days: bigint): Promise<Array<PriceRecord>>;
    seedData(): Promise<void>;
}
