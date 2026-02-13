import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PickAccountLoading = () => {
  return (
    <Card className="p-0 gap-0 w-full max-w-md">
      <h1 className="leading-none font-semibold p-[18px]">
        Identify your account
      </h1>
      <Separator />
      <CardContent className="px-0 py-4">
        <div className="px-4 space-y-4">
          <div className="space-y-1">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 flex w-full justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-25" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-end items-center w-full">
          <Button variant="secondary" className="cursor-pointer">
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickAccountLoading;
