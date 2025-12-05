import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { ArrowLeft, Upload, Loader2, CheckCircle, ExternalLink, X, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { publishEpisode, getCreatorSeries, type Series } from "@/lib/linera";
import { uploadFiles, uploadJSON, getIPFSUrl } from "@/lib/web3storage";
import { useToast } from "@/hooks/use-toast";

type Status = "idle" | "uploading-images" | "uploading-metadata" | "publishing" | "success" | "error";

const PublishEpisode = () => {
  const account = useActiveAccount();
  const { toast } = useToast();
  
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loadingSeries, setLoadingSeries] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      if (!account?.address) {
        setLoadingSeries(false);
        return;
      }
      
      try {
        const data = await getCreatorSeries(account.address);
        setSeries(data);
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoadingSeries(false);
      }
    }

    fetchSeries();
  }, [account?.address]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || images.length === 0) {
      toast({
        title: "Error",
        description: "Please connect wallet and upload episode images",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload images to IPFS
      setStatus("uploading-images");
      setProgress(20);
      const imageFiles = images.map((img) => img.file);
      const imagesCID = await uploadFiles(imageFiles);
      
      // Create and upload metadata
      setStatus("uploading-metadata");
      setProgress(50);
      const metadata = {
        name: episodeTitle,
        description: description,
        seriesId: parseInt(selectedSeriesId),
        episodeNumber: parseInt(episodeNumber),
        images: images.map((_, index) => 
          getIPFSUrl(imagesCID, `${index.toString().padStart(3, "0")}_${images[index].file.name}`)
        ),
        imagesCID,
        pageCount: images.length,
        createdAt: new Date().toISOString(),
      };
      const metadataCID = await uploadJSON(metadata);
      
      // Publish on-chain
      setStatus("publishing");
      setProgress(75);
      const result = await publishEpisode(
        parseInt(selectedSeriesId),
        parseInt(episodeNumber),
        metadataCID,
        price
      );
      
      setTxHash(result.txHash);
      setProgress(100);
      setStatus("success");
      
      toast({
        title: "Episode Published!",
        description: `Episode ID: ${result.episodeId}`,
      });
    } catch (error) {
      console.error("Failed to publish episode:", error);
      setStatus("error");
      setProgress(0);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish episode",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setSelectedSeriesId("");
    setEpisodeNumber("");
    setEpisodeTitle("");
    setDescription("");
    setPrice("");
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setProgress(0);
    setTxHash(null);
  };

  const isFormValid = selectedSeriesId && episodeNumber && episodeTitle && price && images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/creator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Publish Episode</h1>
          <div className="ml-auto">
            <ConnectButton client={client} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!account ? (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to publish episodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton client={client} />
            </CardContent>
          </Card>
        ) : status === "success" ? (
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <CardTitle>Episode Published!</CardTitle>
              <CardDescription>
                Your episode has been published on-chain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {txHash && (
                <a
                  href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View on Polygonscan
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <div className="flex gap-2 justify-center">
                <Link to="/creator/series">
                  <Button variant="outline">View Series</Button>
                </Link>
                <Button onClick={resetForm}>Publish Another</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Publish New Episode</CardTitle>
              <CardDescription>
                Upload episode pages and publish to the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="series">Select Series</Label>
                  <Select
                    value={selectedSeriesId}
                    onValueChange={setSelectedSeriesId}
                    disabled={status !== "idle" || loadingSeries}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingSeries ? "Loading..." : "Select a series"} />
                    </SelectTrigger>
                    <SelectContent>
                      {series.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!loadingSeries && series.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No series found.{" "}
                      <Link to="/creator/new-series" className="text-primary hover:underline">
                        Create one first
                      </Link>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="episodeNumber">Episode Number</Label>
                    <Input
                      id="episodeNumber"
                      type="number"
                      min="1"
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(e.target.value)}
                      placeholder="1"
                      disabled={status !== "idle"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (MATIC)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.01"
                      disabled={status !== "idle"}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="episodeTitle">Episode Title</Label>
                  <Input
                    id="episodeTitle"
                    value={episodeTitle}
                    onChange={(e) => setEpisodeTitle(e.target.value)}
                    placeholder="Enter episode title"
                    disabled={status !== "idle"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter episode description"
                    rows={3}
                    disabled={status !== "idle"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Episode Pages</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={status !== "idle"}
                  />
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border">
                            <img
                              src={img.preview}
                              alt={`Page ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-1 left-1 bg-background/80 rounded px-1.5 py-0.5 text-xs">
                            {index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={status !== "idle"}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {images.length} page{images.length !== 1 ? "s" : ""} selected
                  </p>
                </div>

                {status !== "idle" && status !== "error" && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {status === "uploading-images" && "Uploading images to IPFS..."}
                      {status === "uploading-metadata" && "Uploading metadata..."}
                      {status === "publishing" && "Publishing to blockchain..."}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid || status !== "idle"}
                  className="w-full"
                >
                  {status !== "idle" && status !== "error" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Publish Episode
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PublishEpisode;
