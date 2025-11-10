import { Search, User } from "lucide-react";
import { MangaCard } from "@/components/MangaCard";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import manga1 from "@/assets/manga-1.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";
import manga6 from "@/assets/manga-6.jpg";
import manga7 from "@/assets/manga-7.jpg";
import manga8 from "@/assets/manga-8.jpg";
import manga9 from "@/assets/manga-9.jpg";

const Explore = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const genres = ["Romance", "Fantasy", "Drama", "Mystery", "Action", "Comedy"];
  const statuses = ["Ongoing", "Completed", "New"];

  const allManga = [
    { id: 1, image: manga1, title: "My lucky star", genre: "Romance", rating: "9.8", status: "Ongoing" },
    { id: 2, image: manga2, title: "The queen", genre: "Fantasy", rating: "9.5", status: "Completed" },
    { id: 3, image: manga3, title: "That day in the park", genre: "Romance", rating: "9.2", status: "Ongoing" },
    { id: 4, image: manga4, title: "It may happen", genre: "Drama", rating: "8.9", status: "New" },
    { id: 5, image: manga5, title: "I don't care about you", genre: "Drama", rating: "9.1", status: "Ongoing" },
    { id: 6, image: manga6, title: "Destiny", genre: "Fantasy", rating: "9.7", status: "Completed" },
    { id: 7, image: manga7, title: "My lord", genre: "Romance", rating: "9.4", status: "Ongoing" },
    { id: 8, image: manga8, title: "Who are you", genre: "Mystery", rating: "9.3", status: "New" },
    { id: 9, image: manga9, title: "Little flower", genre: "Romance", rating: "8.8", status: "Ongoing" },
    { id: 10, image: manga1, title: "My lucky star", genre: "Romance", rating: "9.8", status: "Ongoing" },
    { id: 11, image: manga2, title: "The queen", genre: "Fantasy", rating: "9.5", status: "Completed" },
    { id: 12, image: manga3, title: "That day in the park", genre: "Romance", rating: "9.2", status: "Ongoing" },
    { id: 13, image: manga4, title: "It may happen", genre: "Drama", rating: "8.9", status: "New" },
    { id: 14, image: manga5, title: "I don't care about you", genre: "Drama", rating: "9.1", status: "Ongoing" },
    { id: 15, image: manga6, title: "Destiny", genre: "Fantasy", rating: "9.7", status: "Completed" },
  ];

  const filteredManga = allManga.filter(manga => {
    if (selectedGenre && manga.genre !== selectedGenre) return false;
    if (selectedStatus && manga.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
          <span className="text-lg font-bold text-primary">📚</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Explore</h1>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="px-6 mt-4">
        <div className="space-y-4">
          {/* Genre Filter */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "secondary"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "secondary"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          New on Webtoons
          <span className="text-sm text-muted-foreground ml-2">
            ({filteredManga.length} titles)
          </span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {filteredManga.map((manga) => (
            <MangaCard 
              key={manga.id}
              image={manga.image}
              title={manga.title}
              genre={`★ ${manga.rating}`}
            />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Explore;
