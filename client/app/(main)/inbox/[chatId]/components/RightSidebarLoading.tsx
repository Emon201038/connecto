import { Separator } from "@/components/ui/separator";

export function RightSideBarLoader() {
  return (
    <div className="w-full md:max-w-[360px] md:min-w-[300px] p-4 flex flex-col bg-background rounded-sm relative">
      {/* Back button placeholder */}
      <div className="absolute top-4 left-4 w-9 h-9 bg-muted rounded-md animate-pulse" />

      {/* Avatar and nickname section */}
      <div className="flex flex-col items-center mb-6">
        {/* Avatar skeleton */}
        <div className="w-24 h-24 mb-4 bg-muted rounded-full animate-pulse" />

        {/* Nickname skeleton */}
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2" />

        {/* Status text skeleton */}
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
      </div>

      {/* Action buttons section */}
      <div className="flex justify-center space-x-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Collapsible and menu items section */}
      <div className="space-y-4 w-full">
        {/* Customize chat section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
        </div>

        {/* Media, files and links section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
        </div>

        {/* Privacy and support section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
