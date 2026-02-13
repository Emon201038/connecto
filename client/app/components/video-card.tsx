import { Play, MoreHorizontal, Heart, MessageCircle, Share, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Video {
  id: string
  title: string
  creator: string
  creatorAvatar: string
  thumbnail: string
  duration: string
  views: string
  timeAgo: string
  description: string
}

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="w-full bg-card border border-border">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={video.creatorAvatar || "/placeholder.svg"} />
                <AvatarFallback>{video.creator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{video.creator}</h3>
                <p className="text-muted-foreground text-xs">{video.timeAgo}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Post Text */}
          <div className="mt-3">
            <p className="text-foreground text-sm">{video.description}</p>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative group cursor-pointer">
          <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
              <span className="ml-2">{Math.floor(Math.random() * 500 + 100)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{Math.floor(Math.random() * 50 + 10)} comments</span>
              <span>{Math.floor(Math.random() * 20 + 5)} shares</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-around">
            <Button variant="ghost" className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted/50">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Like</span>
            </Button>
            <Button variant="ghost" className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted/50">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Comment</span>
            </Button>
            <Button variant="ghost" className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted/50">
              <Share className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </Button>
            <Button variant="ghost" className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-muted/50">
              <Bookmark className="w-5 h-5" />
              <span className="text-sm font-medium">Save</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments Preview */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
