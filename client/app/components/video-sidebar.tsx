import {
  Play,
  TrendingUp,
  Clock,
  Bookmark,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function VideoSidebar() {
  const menuItems = [
    { icon: Play, label: "Home", active: true },
    { icon: TrendingUp, label: "Trending" },
    { icon: Clock, label: "Watch Later" },
    { icon: Bookmark, label: "Saved Videos" },
    { icon: Users, label: "Following" },
  ];

  const shortcuts = [
    { name: "Gaming Videos", image: "/gaming-controller.png" },
    { name: "Cooking Shows", image: "/white-chef-hat.png" },
    { name: "Tech Reviews", image: "/modern-smartphone.png" },
    { name: "Music Videos", image: "/single-music-note.png" },
  ];

  return (
    <aside className="p-4 border-r border-border">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Watch</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-12"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3 text-foreground">Your Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <Button
                key={shortcut.name}
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
              >
                <img
                  src={shortcut.image || "/placeholder.svg"}
                  alt={shortcut.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                {shortcut.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <Settings className="w-5 h-5" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
