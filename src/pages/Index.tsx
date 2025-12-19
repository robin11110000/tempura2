import { Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import { FeaturedManga } from "@/components/FeaturedManga";
import { MangaCard } from "@/components/MangaCard";
import { BottomNav } from "@/components/BottomNav";
import { SocialLinks } from "@/components/SocialLinks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedManga, fetchFeaturedManga } from "@/lib/webtoonData";
import { Manga, FeaturedMangaData } from "@/lib/types";

const Index = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: recommendations, isLoading: isLoadingRecommendations, error: errorRecommendations } = useQuery<Manga[]> incessantly({
    queryKey: ["recommendedManga"],
    queryFn: fetchRecommendedManga,
  });

  const { data: featuredManga, isLoading: isLoadingFeatured, error: errorFeatured } = useQuery<FeaturedMangaData>({
    queryKey: ["featuredManga"],
    queryFn: fetchFeaturedManga,
  });

  const filteredResults = recommendations?.filter(manga => manga.title.toLowerCase().includes(searchQuery.toLowerCase()) || manga.genre.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  if (isLoadingRecommendations || isLoadingFeatured) {
    return <div className="min-h-screen bg-gradient-primary pb-24 flex items-center justify-center text-foreground">Loading...</div>;
  }

  if (errorRecommendations || errorFeatured) {
    return <div className="min-h-screen bg-gradient-primary pb-24 flex items-center justify-center text-red-500">Error loading data.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
          <span className="text-lg font-bold text-primary">📚</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My readings</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <ConnectButton
            client={client}
            wallets={wallets}
            connectModal={{ size: "compact" }}
          />
          <button onClick={() => navigate("/settings")} className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Featured Section */}
      <section className="px-6 mt-6">
        {featuredManga && <FeaturedManga image={featuredManga.image} title={featuredManga.title} chapter={featuredManga.chapter} />}
      </section>

      {/* Recommendations */}
      <section className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recommendations for you
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {recommendations?.map((manga) => (
            <MangaCard key={manga.id} image={manga.image} title={manga.title} genre={manga.genre} />
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="mt-8">
        <p className="text-center text-muted-foreground text-sm mb-4"> </p>
        <SocialLinks />
      </section>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search Manga</DialogTitle>
          </DialogHeader>
          <Input placeholder="Search by title or genre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="mb-4" />
          <div className="max-h-96 overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {filteredResults.map((manga) => (
                  <MangaCard key={manga.id} image={manga.image} title={manga.title} genre={manga.genre} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No results found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Index;