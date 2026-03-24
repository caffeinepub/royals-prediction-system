import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AnalysisPage } from "./pages/AnalysisPage";
import { CommoditiesPage } from "./pages/CommoditiesPage";
import { CommodityDetail } from "./pages/CommodityDetail";
import { Dashboard } from "./pages/Dashboard";
import { MarketsPage } from "./pages/MarketsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const commoditiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commodities",
  component: CommoditiesPage,
});

const commodityDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/commodity/$name",
  component: CommodityDetail,
});

const marketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/markets",
  component: MarketsPage,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analysis",
  component: AnalysisPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  commoditiesRoute,
  commodityDetailRoute,
  marketsRoute,
  analysisRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
