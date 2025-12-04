import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { BrowserProvider, Contract } from "ethers";
import { ArrowLeft, Upload, Loader2, CheckCircle, ExternalLink, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EPISODE_NFT_ADDRESS, EPISODE_NFT_ABI, POLYGON_MUMBAI_CHAIN_ID } from "@/lib/contracts/EpisodeNFT";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const NFT_STORAGE_API_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY || "";

interface MintState {
  status: "idle" | "uploading" | "minting" | "success" | "error";
  txHash?: string;
  tokenId?: string;
  error?: string;
}

export default function MintEpisode() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [mintState, setMintState] = useState<MintState>({ status: "idle" });

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NFT_STORAGE_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS");
    }

    const data = await response.json();
    return `ipfs://${data.value.cid}`;
  };

  const uploadMetadataToIPFS = async (metadata: object): Promise<string> => {
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const file = new File([blob], "metadata.json", { type: "application/json" });
    return uploadToIPFS(file);
  };

  const handleMint = async () => {
    if (!account?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (chain?.id !== POLYGON_MUMBAI_CHAIN_ID) {
      toast({
        title: "Wrong network",
        description: "Please switch to Polygon Mumbai testnet",
        variant: "destructive",
      });
      return;
    }

    if (!title || !seriesId || !episodeNumber || images.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields and add at least one image",
        variant: "destructive",
      });
      return;
    }

    if (!NFT_STORAGE_API_KEY) {
      toast({
        title: "Missing API Key",
        description: "NFT.Storage API key is not configured",
        variant: "destructive",
      });
      return;
    }

    try {
      setMintState({ status: "uploading" });

      // Upload all images to IPFS
      const imageURIs: string[] = [];
      for (const image of images) {
        const uri = await uploadToIPFS(image);
        imageURIs.push(uri);
      }

      // Generate metadata
      const metadata = {
        name: title,
        description: description || `Episode ${episodeNumber} from Series ${seriesId}`,
        image: imageURIs[0], // First image as cover
        attributes: [
          { trait_type: "Series ID", value: seriesId },
          { trait_type: "Episode Number", value: episodeNumber },
          { trait_type: "Creator", value: account.address },
          { trait_type: "Page Count", value: images.length.toString() },
        ],
        properties: {
          pages: imageURIs,
          seriesId: parseInt(seriesId),
          episodeNumber: parseInt(episodeNumber),
        },
      };

      const metadataURI = await uploadMetadataToIPFS(metadata);

      setMintState({ status: "minting" });

      // Get ethers provider from window.ethereum
      if (!window.ethereum) {
        throw new Error("No wallet provider found");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contract = new Contract(EPISODE_NFT_ADDRESS, EPISODE_NFT_ABI, signer);

      // Call mintEpisode
      const tx = await contract.mintEpisode(
        account.address,
        metadataURI,
        BigInt(seriesId),
        BigInt(episodeNumber)
      );

      const receipt = await tx.wait();
      
      // Get token ID from events (simplified - in production parse logs properly)
      const tokenId = receipt?.logs?.[0]?.topics?.[3] 
        ? parseInt(receipt.logs[0].topics[3], 16).toString()
        : "Unknown";

      setMintState({
        status: "success",
        txHash: receipt.hash,
        tokenId,
      });

      toast({
        title: "Episode minted!",
        description: `Token ID: ${tokenId}`,
      });

    } catch (error) {
      console.error("Minting error:", error);
      setMintState({
        status: "error",
        error: error instanceof Error ? error.message : "Failed to mint",
      });
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const isLoading = mintState.status === "uploading" || mintState.status === "minting";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Mint Episode NFT</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Wallet Status */}
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Wallet</span>
              {account?.address ? (
                <span className="text-sm font-mono text-primary">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </span>
              ) : (
                <span className="text-destructive">Not connected</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-muted-foreground">Network</span>
              <span className={chain?.id === POLYGON_MUMBAI_CHAIN_ID ? "text-green-500" : "text-yellow-500"}>
                {chain?.id === POLYGON_MUMBAI_CHAIN_ID ? "Polygon Mumbai ✓" : "Wrong network"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Episode Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Episode Details</CardTitle>
            <CardDescription>Enter information about this episode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Episode title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this episode..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seriesId">Series ID *</Label>
                <Input
                  id="seriesId"
                  type="number"
                  placeholder="1"
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episodeNumber">Episode # *</Label>
                <Input
                  id="episodeNumber"
                  type="number"
                  placeholder="1"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Episode Pages *</CardTitle>
            <CardDescription>Upload the pages for this episode (in order)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img src={preview} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-background/80 text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <label className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
                <span className="text-muted-foreground">Click to add images</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB each</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={isLoading}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Mint Status */}
        {mintState.status === "success" && mintState.txHash && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="font-semibold text-green-500">Minted Successfully!</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono">{mintState.tokenId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction</span>
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${mintState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline font-mono"
                  >
                    {mintState.txHash.slice(0, 8)}...
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {mintState.status === "error" && (
          <Card className="bg-destructive/10 border-destructive/30">
            <CardContent className="pt-4">
              <p className="text-destructive">{mintState.error}</p>
            </CardContent>
          </Card>
        )}

        {/* Mint Button */}
        <Button
          onClick={handleMint}
          disabled={isLoading || !account?.address}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {mintState.status === "uploading" && (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading to IPFS...
            </>
          )}
          {mintState.status === "minting" && (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Minting NFT...
            </>
          )}
          {(mintState.status === "idle" || mintState.status === "error") && (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Mint Episode NFT
            </>
          )}
          {mintState.status === "success" && "Mint Another Episode"}
        </Button>
      </main>
    </div>
  );
}
