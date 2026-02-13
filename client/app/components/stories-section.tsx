import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronRight, Plus } from "lucide-react"

export default function StoriesSection() {
  // Mock stories data
  const stories = [
    {
      id: "1",
      user: {
        name: "Your Story",
        avatar: "/images/default-profile.jpeg",
      },
      image: "/images/feeds.png",
      isYourStory: true,
    },
    {
      id: "2",
      user: {
        name: "John Doe",
        avatar: "/images/default-profile.jpeg",
      },
      image: "/images/feeds.png",
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar: "/images/default-profile.jpeg",
      },
      image: "/images/mycric-page.png",
    },
    {
      id: "4",
      user: {
        name: "Michael Brown",
        avatar: "/images/default-profile.jpeg",
      },
      image: "/images/scorecard.png",
    },
    {
      id: "5",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      },
      image: "/placeholder.svg?height=200&width=110&text=Story+4",
    },
    {
      id: "6",
      user: {
        name: "David Garcia",
        avatar: "/placeholder.svg?height=40&width=40&text=DG",
      },
      image: "/placeholder.svg?height=200&width=110&text=Story+5",
    },
  ]

  return (
    <Card className="p-4 mb-4 relative">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          {stories.map((story) => (
            <Link key={story.id} href="#" className="w-[110px] flex-shrink-0 overflow-hidden rounded-lg relative group">
              <div className={`h-48 w-full relative ${story.isYourStory ? "bg-muted" : ""}`}>
                {story.isYourStory ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium">Create story</span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.user.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 group-hover:from-black/40 group-hover:to-black/40 transition-colors" />
                  </>
                )}
              </div>
              {!story.isYourStory && (
                <div className="absolute top-2 left-2 border-4 border-blue-600 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={story.user.avatar || "/placeholder.svg"} alt={story.user.name} />
                    <AvatarFallback>{story.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              {!story.isYourStory && (
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">{story.user.name}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background shadow-lg"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}
