import { Link } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { ArrowLeft, BookOpen, PlusCircle, Upload, Coins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

const CreatorDashboard = () => {
  const account = useActiveAccount();

  const dashboardItems = [
    {
      title: "My Series",
      description: "View and manage your created series",
      icon: BookOpen,
      href: "/creator/series",
      color: "text-blue-500",
    },
    {
      title: "Create New Series",
      description: "Start a new webtoon or manga series",
      icon: PlusCircle,
      href: "/creator/new-series",
      color: "text-green-500",
    },
    {
      title: "Publish Episode",
      description: "Upload and publish new episodes",
      icon: Upload,
      href: "/creator/publish",
      color: "text-purple-500",
    },
    {
      title: "Mint NFT",
      description: "Mint episodes as NFTs",
      icon: Coins,
      href: "/creator/mint",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Creator Dashboard</h1>
          <div className="ml-auto">
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
                Connect your wallet to access creator tools and publish your content on-chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton client={client} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-muted-foreground">
                Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-8 w-8 ${item.color}`} />
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CreatorDashboard;
