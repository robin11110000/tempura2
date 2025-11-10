import { ArrowLeft, Heart, Share2, Download, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import featuredImage from "@/assets/featured-manga.jpg";
import manga1 from "@/assets/manga-1.jpg";
import manga2 from "@/assets/manga-2.jpg";
import manga3 from "@/assets/manga-3.jpg";
import manga4 from "@/assets/manga-4.jpg";
import manga5 from "@/assets/manga-5.jpg";
import manga6 from "@/assets/manga-6.jpg";
import manga7 from "@/assets/manga-7.jpg";
import manga8 from "@/assets/manga-8.jpg";
import manga9 from "@/assets/manga-9.jpg";

const WebtoonDetail = () => {
  const navigate = useNavigate();

  const episodes = [
    { id: 9, title: "Lorem ipsum dolor sit", thumbnail: manga1, isLiked: false },
    { id: 8, title: "Dignissim cras", thumbnail: manga2, isLiked: false },
    { id: 7, title: "Ivemus posuere", thumbnail: manga3, isLiked: false },
    { id: 6, title: "Quis porta", thumbnail: manga4, isLiked: false },
    { id: 5, title: "Sed nunc", thumbnail: manga5, isLiked: false },
    { id: 4, title: "Fringilla turpis faucibus", thumbnail: manga6, isLiked: false },
    { id: 3, title: "Diam malesuada", thumbnail: manga7, isLiked: false },
    { id: 2, title: "Ullamcorper", thumbnail: manga8, isLiked: false },
    { id: 1, title: "Lacus digniz", thumbnail: manga9, isLiked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-8">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={featuredImage} 
          alt="Finding Camelia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <button className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-0 right-0 px-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finding Camelia</h1>
          <p className="text-sm text-muted-foreground">From the lovely Reading Bus Home</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-6 flex items-center gap-3">
        <Button className="flex-1" size="lg">
          <Star className="w-4 h-4 mr-2" />
          Subscribe
        </Button>
        <Button variant="secondary" size="lg">
          <Heart className="w-4 h-4 mr-2" />
          Like
        </Button>
        <Button variant="secondary" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6 flex items-center justify-around py-4 bg-card/30 rounded-xl mx-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">9.8</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">2.4M</div>
          <div className="text-xs text-muted-foreground">Subscribers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">45</div>
          <div className="text-xs text-muted-foreground">Episodes</div>
        </div>
      </div>

      {/* Episodes List */}
      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Episodes</h2>
          <Badge variant="secondary">Latest first</Badge>
        </div>

        <div className="space-y-3">
          {episodes.map((episode) => (
            <div 
              key={episode.id}
              className="flex items-center gap-4 p-3 bg-card/30 rounded-xl hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <img 
                src={episode.thumbnail}
                alt={`Episode ${episode.id}`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Episode {episode.id} - {episode.title}
                </h3>
              </div>
              <button className="text-muted-foreground hover:text-accent transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WebtoonDetail;
