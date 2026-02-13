"use client";
import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Link = ({
  href,
  Icon,
  children,
}: {
  href: string;
  Icon: React.ElementType;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <NextLink
      href={href}
      className={cn(
        "relative flex gap-3 items-center hover:bg-muted p-2 rounded-md",
        pathname === href ? "bg-muted/70" : ""
      )}
    >
      <div
        className={cn(
          "size-9 p-2 flex justify-center items-center rounded-full",
          pathname === href ? "bg-primary " : "bg-secondary-btn-bg"
        )}
      >
        <Icon className={cn(pathname === href ? "invert" : "")} />
      </div>
      <div className="text-lg font-semibold">{children}</div>
    </NextLink>
  );
};

export default Link;
