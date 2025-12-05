import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { ArrowLeft, PlusCircle, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { getCreatorSeries, type Series } from "@/lib/linera";
import { getIPFSUrl } from "@/lib/web3storage";

const CreatorSeries = () => {
  const account = useActiveAccount();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      if (!account?.address) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getCreatorSeries(account.address);
        setSeries(data);
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSeries();
  }, [account?.address]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/creator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">My Series</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/creator/new-series">
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Series
              </Button>
            </Link>
            <ConnectButton client={client} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!account ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to view your series.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton client={client} />
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : series.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>No Series Yet</CardTitle>
              <CardDescription>
                Create your first series to start publishing episodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/creator/new-series">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Series
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <Card key={s.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative">
                  <img
                    src={getIPFSUrl(s.coverURI)}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{s.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    {s.episodeCount} episode{s.episodeCount !== 1 ? "s" : ""}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatorSeries;
