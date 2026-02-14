import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function LoadingFeed() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="overflow-hidden p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </Card>
      ))}
    </div>
  )
}
