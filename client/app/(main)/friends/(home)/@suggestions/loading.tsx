import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        People You May Know
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-[264px] rounded-md"></Skeleton>
        ))}
      </div>
    </div>
  );
};

export default loading;
