import { Search, Bell, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VideoHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">facebook</h1>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search Facebook" className="pl-10 w-64 bg-muted border-0" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
            <Users className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-6 h-6" />
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/user-profile-illustration.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
