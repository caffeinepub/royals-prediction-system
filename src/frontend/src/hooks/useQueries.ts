import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Commodity, Market, NewsItem, PriceRecord } from "../backend.d";
import { useActor } from "./useActor";

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useAllCommodities() {
  const { actor, isFetching } = useActor();
  return useQuery<Commodity[]>({
    queryKey: ["commodities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommodities();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllMarkets() {
  const { actor, isFetching } = useActor();
  return useQuery<Market[]>({
    queryKey: ["markets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMarkets();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePriceHistory(
  commodity: string,
  market: string,
  days: number,
) {
  const { actor, isFetching } = useActor();
  return useQuery<PriceRecord[]>({
    queryKey: ["priceHistory", commodity, market, days],
    queryFn: async () => {
      if (!actor || !commodity || !market) return [];
      return actor.getPriceHistory(commodity, market, BigInt(days));
    },
    enabled: !!actor && !isFetching && !!commodity && !!market,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAllNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsItem[]>({
    queryKey: ["allNews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useNewsForMarket(market: string) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsItem[]>({
    queryKey: ["news", market],
    queryFn: async () => {
      if (!actor || !market) return [];
      return actor.getNewsForMarket(market);
    },
    enabled: !!actor && !isFetching && !!market,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCommodity(name: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Commodity>({
    queryKey: ["commodity", name],
    queryFn: async () => {
      if (!actor || !name) throw new Error("No actor or name");
      return actor.getCommodity(name);
    },
    enabled: !!actor && !isFetching && !!name,
    staleTime: 5 * 60 * 1000,
  });
}
