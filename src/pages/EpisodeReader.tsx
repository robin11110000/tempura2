import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { ChevronLeft, ChevronRight, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEpisode, getSeries, getSeriesEpisodes, checkEpisodeUnlocked, unlockEpisode, Episode, Series } from "@/lib/linera";
import { useToast } from "@/hooks/use-toast";

interface EpisodeMetadata {
  name: string;
  description: string;
  images: string[];
}

export default function EpisodeReader() {
  const { id, ep } = useParams<{ id: string; ep: string }>();
  const navigate = useNavigate();
  const account = useActiveAccount();
  const { toast } = useToast();

  const [series, setSeries] = useState<Series | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [metadata, setMetadata] = useState<EpisodeMetadata | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const seriesId = parseInt(id || "0");
  const episodeNumber = parseInt(ep || "1");

  useEffect(() => {
    loadData();
  }, [seriesId, episodeNumber, account?.address]);

  async function loadData() {
    setLoading(true);
    try {
      const [seriesData, episodeData, allEpisodes] = await Promise.all([
        getSeries(seriesId),
        getEpisode(seriesId, episodeNumber),
        getSeriesEpisodes(seriesId),
      ]);

      setSeries(seriesData);
      setEpisode(episodeData);
      setEpisodes(allEpisodes.sort((a, b) => a.episodeNumber - b.episodeNumber));

      if (episodeData) {
        // Check if episode is free or user has unlocked
        const isFree = parseFloat(episodeData.price) === 0;
        let unlocked = isFree;

        if (!isFree && account?.address) {
          unlocked = await checkEpisodeUnlocked(seriesId, episodeNumber, account.address);
        }

        setIsUnlocked(unlocked);

        if (unlocked || isFree) {
          // Fetch metadata from IPFS
          await loadMetadata(episodeData.metadataURI);
        } else {
          setShowUnlockModal(true);
        }
      }
    } catch (error) {
      console.error("Error loading episode:", error);
      toast({
        title: "Error",
        description: "Failed to load episode data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadMetadata(metadataURI: string) {
    try {
      // Convert IPFS URI to gateway URL
      const url = metadataURI.startsWith("ipfs://")
        ? metadataURI.replace("ipfs://", "https://w3s.link/ipfs/")
        : metadataURI;

      const response = await fetch(url);
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Error loading metadata:", error);
    }
  }

  async function handleUnlock() {
    if (!episode || !account) return;

    setUnlocking(true);
    try {
      const { txHash } = await unlockEpisode(seriesId, episodeNumber, episode.price);
      toast({
        title: "Episode Unlocked!",
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      });
      setIsUnlocked(true);
      setShowUnlockModal(false);
      await loadMetadata(episode.metadataURI);
    } catch (error: any) {
      toast({
        title: "Unlock Failed",
        description: error.message || "Failed to unlock episode",
        variant: "destructive",
      });
    } finally {
      setUnlocking(false);
    }
  }

  function getImageUrl(cid: string) {
    if (cid.startsWith("ipfs://")) {
      return cid.replace("ipfs://", "https://w3s.link/ipfs/");
    }
    if (cid.startsWith("http")) {
      return cid;
    }
    return `https://w3s.link/ipfs/${cid}`;
  }

  const currentIndex = episodes.findIndex((e) => e.episodeNumber === episodeNumber);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!episode || !series) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Episode not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-medium truncate max-w-[200px]">{series.title}</h1>
            <p className="text-xs text-muted-foreground">Episode {episodeNumber}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Episode Images */}
      {isUnlocked && metadata ? (
        <div className="flex flex-col items-center">
          {metadata.images.map((img, index) => (
            <img
              key={index}
              src={getImageUrl(img)}
              alt={`Page ${index + 1}`}
              className="w-full max-w-3xl"
              loading="lazy"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">This episode is locked</p>
          <Button onClick={() => setShowUnlockModal(true)}>
            Unlock for {episode.price} ETH
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex items-center justify-between px-4 h-14 max-w-3xl mx-auto">
          <Button
            variant="ghost"
            disabled={!prevEpisode}
            onClick={() => prevEpisode && navigate(`/series/${seriesId}/episode/${prevEpisode.episodeNumber}`)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {episodeNumber} / {episodes.length || "?"}
          </span>
          <Button
            variant="ghost"
            disabled={!nextEpisode}
            onClick={() => nextEpisode && navigate(`/series/${seriesId}/episode/${nextEpisode.episodeNumber}`)}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Unlock Modal */}
      <Dialog open={showUnlockModal} onOpenChange={setShowUnlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Episode {episodeNumber}</DialogTitle>
            <DialogDescription>
              This episode requires payment to access. Connect your wallet and pay to unlock.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-semibold">{episode.price} ETH</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={handleUnlock} disabled={unlocking || !account}>
              {unlocking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlocking...
                </>
              ) : !account ? (
                "Connect Wallet"
              ) : (
                `Pay ${episode.price} ETH`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
