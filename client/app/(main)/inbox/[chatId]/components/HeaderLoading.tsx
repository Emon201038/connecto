import React from "react";
import BackButton from "./BackButton";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const HeaderLoading = () => {
  return (
    <div className="px-4 py-3 border-b flex items-center justify-between h-[52px]">
      <div className="flex items-center gap-3">
        <BackButton toHref={"/inbox"} className="md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </BackButton>
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="w-20 h-9" />
          <div className="text-sm text-muted-foreground text-ellipsis whitespace-nowrap">
            Active now
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </div>
  );
};

export default HeaderLoading;
