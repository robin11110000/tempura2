import { ArrowLeft, User, Bell, Lock, Palette, Globe, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const Settings = () => {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", description: "Edit your profile information" },
        { icon: Bell, label: "Notifications", description: "Manage your notifications" },
        { icon: Lock, label: "Privacy", description: "Control your privacy settings" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Palette, label: "Appearance", description: "Customize the app look" },
        { icon: Globe, label: "Language", description: "Change app language" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", description: "Get help and support" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-glow"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Profile Section */}
      <section className="px-6 mt-6">
        <div className="bg-card/30 rounded-xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Manga Reader</h2>
            <p className="text-sm text-muted-foreground">reader@example.com</p>
          </div>
        </div>
      </section>

      {/* Settings Groups */}
      <section className="px-6 mt-8 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              {group.title}
            </h3>
            <div className="bg-card/30 rounded-xl overflow-hidden">
              {group.items.map((item, idx) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-card/50 transition-colors ${
                    idx !== group.items.length - 1 ? 'border-b border-border/50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-medium text-foreground">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Logout Button */}
      <section className="px-6 mt-8">
        <button className="w-full bg-destructive/20 hover:bg-destructive/30 rounded-xl p-4 flex items-center justify-center gap-3 transition-colors">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">Log Out</span>
        </button>
      </section>

      <BottomNav />
    </div>
  );
};

export default Settings;
