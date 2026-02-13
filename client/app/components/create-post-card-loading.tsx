import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, ImageIcon, Smile } from "lucide-react";

export function PostCreationSkeleton() {
  return (
    <Card className="mb-4 gap-2 pt-3 pb-2.5">
      <CardContent className="px-4">
        <div className="flex gap-2">
          {/* Avatar skeleton */}
          <Skeleton className="w-10 h-10 rounded-full" />

          {/* Input button skeleton */}
          <Skeleton className="flex-1 h-10 rounded-[20px]" />
        </div>
      </CardContent>

      <CardFooter className="px-2 border-t !pt-2">
        <div className="grid grid-cols-3 w-full">
          {/* Live Video button skeleton */}
          <div className="flex items-center justify-center p-2 gap-1">
            <Video className="h-5 w-5 text-red-600 opacity-50" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Photo/Video button skeleton */}
          <div className="flex items-center justify-center p-2 gap-1">
            <ImageIcon className="h-5 w-5 text-green-600 opacity-50" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Feeling/Activity button skeleton */}
          <div className="flex items-center justify-center p-2 gap-1">
            <Smile className="h-5 w-5 text-yellow-500 opacity-50" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
