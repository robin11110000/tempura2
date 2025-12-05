import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import WebtoonDetail from "./pages/WebtoonDetail";
import CreatorDashboard from "./pages/creator/index";
import CreatorSeries from "./pages/creator/Series";
import NewSeries from "./pages/creator/NewSeries";
import PublishEpisode from "./pages/creator/Publish";
import MintEpisode from "./pages/creator/MintEpisode";
import EpisodeReader from "./pages/EpisodeReader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThirdwebProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/webtoon/:id" element={<WebtoonDetail />} />
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/creator/series" element={<CreatorSeries />} />
            <Route path="/creator/new-series" element={<NewSeries />} />
            <Route path="/creator/publish" element={<PublishEpisode />} />
            <Route path="/creator/mint" element={<MintEpisode />} />
            <Route path="/series/:id/episode/:ep" element={<EpisodeReader />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThirdwebProvider>
  </QueryClientProvider>
);

export default App;
