import { VideoFeed } from "@/components/modules/video/video-feed";
import { VideoSidebar } from "@/components/modules/video/video-sidebar";
import { VideoHeader } from "@/components/modules/video/video-header";

export default function VideosPage() {
  return (
    <div className="flex w-full mx-auto p-4">
      <main className="flex-1 py-6">
        <VideoFeed />
      </main>
    </div>
  );
}
