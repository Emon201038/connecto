import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingMessages = () => {
  return (
    <div className="flex flex-col w-full gap-1">
      <div className="h-8 flex justify-start w-full">
        <Skeleton className="flex w-15" />
      </div>
      <div className="h-8 flex justify-start">
        <Skeleton className="flex w-10" />
      </div>
      <div className="h-8 flex justify-end">
        <Skeleton className="flex w-20" />
      </div>
      <div className="h-8 flex justify-start">
        <Skeleton className="flex w-8" />
      </div>
      <div className="h-8 flex justify-start w-full">
        <Skeleton className="flex w-15" />
      </div>
      <div className="h-8 flex justify-start">
        <Skeleton className="flex w-10" />
      </div>
      <div className="h-8 flex justify-end">
        <Skeleton className="flex w-20" />
      </div>
      <div className="h-8 flex justify-start">
        <Skeleton className="flex w-8" />
      </div>
    </div>
  );
};

export default LoadingMessages;
