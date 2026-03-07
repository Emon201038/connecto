import { StoriesContainer } from "@/components/modules/story/story-container";
import { storyApi } from "@/redux/features/story/storyApi";
import { store } from "@/redux/store";
import { Plus } from "lucide-react";

const StoryPage = async () => {
  const data = await store.dispatch(
    storyApi.endpoints.getAllStories.initiate(),
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide relative px-0">
      <StoriesContainer stories={data?.data || []} isLoading={false} />
    </div>
  );
};

export default StoryPage;
