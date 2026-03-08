import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateStoryMutation } from "@/redux/features/story/storyApi";

export const Footer = ({ onDiscard, onCreate, className }: any) => {
  const [createStory, { isLoading }] = useCreateStoryMutation();
  return (
    <div className={cn("grid grid-cols-2 gap-3 items-center", className)}>
      <Button disabled={isLoading} onClick={onDiscard} variant="secondary">
        Discard
      </Button>
      <Button disabled={isLoading} onClick={onCreate}>
        Share to story
      </Button>
    </div>
  );
};
