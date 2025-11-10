import { Search, User } from "lucide-react";
import { MangaCard } from "@/components/MangaCard";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import featuredImage from "@/assets/featured-manga.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";

const Library = () => {
  const favorites = [
    { id: 1, image: featuredImage, title: "Finding Camelia", genre: "★ 9.8" },
    { id: 2, image: manga2, title: "The queen", genre: "★ 9.5" },
    { id: 3, image: manga3, title: "That day in the park", genre: "★ 9.2" },
    { id: 4, image: manga4, title: "It may happen", genre: "★ 8.9" },
    { id: 5, image: manga5, title: "I don't care about you", genre: "★ 9.1" },
  ];

  const reading = [
    { id: 1, image: featuredImage, title: "Finding Camelia", genre: "★ 9.8" },
    { id: 2, image: manga2, title: "The queen", genre: "★ 9.5" },
  ];

  const history = [
    { id: 1, image: manga3, title: "That day in the park", genre: "★ 9.2" },
    { id: 2, image: manga4, title: "It may happen", genre: "★ 8.9" },
    { id: 3, image: manga5, title: "I don't care about you", genre: "★ 9.1" },
  ];

  const downloads = [
    { id: 1, image: featuredImage, title: "Finding Camelia", genre: "★ 9.8" },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
          <span className="text-lg font-bold text-primary">📚</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">My library</h1>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <section className="px-6 mt-6">
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-card/50">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {favorites.map((manga) => (
                <MangaCard 
                  key={manga.id}
                  image={manga.image}
                  title={manga.title}
                  genre={manga.genre}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reading" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {reading.map((manga) => (
                <MangaCard 
                  key={manga.id}
                  image={manga.image}
                  title={manga.title}
                  genre={manga.genre}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {history.map((manga) => (
                <MangaCard 
                  key={manga.id}
                  image={manga.image}
                  title={manga.title}
                  genre={manga.genre}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {downloads.map((manga) => (
                <MangaCard 
                  key={manga.id}
                  image={manga.image}
                  title={manga.title}
                  genre={manga.genre}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <BottomNav />
    </div>
  );
};

export default Library;
