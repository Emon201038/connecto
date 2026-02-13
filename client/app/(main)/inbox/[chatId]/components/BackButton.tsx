"use client";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BackButton({
  children,
  className = "",
  toHref,
}: {
  children: ReactNode;
  className?: string;
  toHref?: string;
}) {
  const router = useRouter();
  return (
    <Button
      className={cn(className)}
      onClick={() => {
        if (toHref) {
          router.push(toHref);
          return;
        }
        router.back();
      }}
      variant="ghost"
      size="icon"
    >
      {children}
    </Button>
  );
}
