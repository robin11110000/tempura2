import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { ArrowLeft, Upload, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { createSeries } from "@/lib/linera";
import { uploadFile } from "@/lib/web3storage";
import { useToast } from "@/hooks/use-toast";

type Status = "idle" | "uploading" | "creating" | "success" | "error";

const NewSeries = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !coverFile) {
      toast({
        title: "Error",
        description: "Please connect wallet and upload a cover image",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload cover to IPFS
      setStatus("uploading");
      const coverCID = await uploadFile(coverFile);
      
      // Create series on-chain
      setStatus("creating");
      const result = await createSeries(title, description, coverCID);
      
      setTxHash(result.txHash);
      setStatus("success");
      
      toast({
        title: "Series Created!",
        description: `Series ID: ${result.seriesId}`,
      });
    } catch (error) {
      console.error("Failed to create series:", error);
      setStatus("error");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create series",
        variant: "destructive",
      });
    }
  };

  const isFormValid = title.trim() && description.trim() && coverFile;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/creator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Create New Series</h1>
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
                Connect your wallet to create a new series.
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
              <CardTitle>Series Created Successfully!</CardTitle>
              <CardDescription>
                Your series has been created on-chain.
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
                  <Button variant="outline">View My Series</Button>
                </Link>
                <Button onClick={() => {
                  setStatus("idle");
                  setTitle("");
                  setDescription("");
                  setCoverFile(null);
                  setCoverPreview(null);
                  setTxHash(null);
                }}>
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>New Series</CardTitle>
              <CardDescription>
                Create a new webtoon or manga series. The cover will be uploaded to IPFS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter series title"
                    disabled={status !== "idle"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter series description"
                    rows={4}
                    disabled={status !== "idle"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image</Label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        disabled={status !== "idle"}
                        required
                      />
                    </div>
                    {coverPreview && (
                      <div className="w-32 aspect-[3/4] rounded-lg overflow-hidden border border-border">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || status !== "idle"}
                  className="w-full"
                >
                  {status === "uploading" && (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading to IPFS...
                    </>
                  )}
                  {status === "creating" && (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Series...
                    </>
                  )}
                  {status === "idle" && (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Series
                    </>
                  )}
                  {status === "error" && "Try Again"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default NewSeries;
