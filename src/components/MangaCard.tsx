import { useNavigate } from "react-router-dom";

interface MangaCardProps {
  image: string;
  title: string;
  genre: string;
}

export const MangaCard = ({ image, title, genre }: MangaCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate('/webtoon/1')}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105"
    >
      <div className="aspect-[3/4] relative bg-card">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{genre}</p>
        </div>
      </div>
    </div>
  );
};
