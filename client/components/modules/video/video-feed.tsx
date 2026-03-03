import { VideoCard } from "@/components/video-card"

const mockVideos = [
  {
    id: "1",
    title: "Amazing Nature Documentary - Wildlife in 4K",
    creator: "Nature Explorer",
    creatorAvatar: "/nature-photographer.jpg",
    thumbnail: "/wildlife-documentary.png",
    duration: "12:34",
    views: "2.1M",
    timeAgo: "2 days ago",
    description: "Explore the breathtaking world of wildlife in stunning 4K resolution...",
  },
  {
    id: "2",
    title: "Cooking Masterclass: Perfect Pasta Every Time",
    creator: "Chef Maria",
    creatorAvatar: "/female-chef.png",
    thumbnail: "/pasta-cooking.png",
    duration: "8:45",
    views: "856K",
    timeAgo: "1 day ago",
    description: "Learn the secrets to making restaurant-quality pasta at home...",
  },
  {
    id: "3",
    title: "Latest Tech Review: iPhone 15 Pro Max Deep Dive",
    creator: "TechReviewer",
    creatorAvatar: "/tech-reviewer.png",
    thumbnail: "/iphone-review.jpg",
    duration: "15:22",
    views: "3.4M",
    timeAgo: "3 hours ago",
    description: "Complete review of the new iPhone 15 Pro Max with all features...",
  },
  {
    id: "4",
    title: "Relaxing Music for Study and Work - 2 Hours",
    creator: "Ambient Sounds",
    creatorAvatar: "/music-producer-studio.png",
    thumbnail: "/peaceful-music.jpg",
    duration: "2:00:15",
    views: "1.2M",
    timeAgo: "1 week ago",
    description: "Perfect background music for productivity and focus...",
  },
  {
    id: "5",
    title: "Travel Vlog: Hidden Gems in Japan",
    creator: "Wanderlust Adventures",
    creatorAvatar: "/travel-blogger.png",
    thumbnail: "/japan-travel.jpg",
    duration: "18:30",
    views: "945K",
    timeAgo: "4 days ago",
    description: "Discover amazing places in Japan that most tourists never see...",
  },
  {
    id: "6",
    title: "Fitness Challenge: 30-Day Transformation",
    creator: "FitLife Coach",
    creatorAvatar: "/diverse-fitness-trainer.png",
    thumbnail: "/diverse-fitness-workout.png",
    duration: "25:10",
    views: "678K",
    timeAgo: "5 days ago",
    description: "Complete 30-day fitness program for beginners and advanced...",
  },
]

export function VideoFeed() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Videos</h2>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm">
            <option>All Videos</option>
            <option>Following</option>
            <option>Live</option>
            <option>Recently Added</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
