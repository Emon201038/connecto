import { VideoFeed } from "@/components/video-feed";
import { VideoSidebar } from "@/components/video-sidebar";
import { VideoHeader } from "@/components/video-header";

export default function VideosPage() {
  return (
    <div className="flex w-full mx-auto p-4">
      <main className="flex-1 py-6">
        <VideoFeed />
      </main>
    </div>
  );
}
