"use client";
import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

const Link = ({
  href,
  children,
  className,
  index,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  index: string;
}) => {
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();

  const lastSegment = pathname.split(params.groupId)[1].split("/");

  const isActive = lastSegment[lastSegment.length - 1] === index ? true : false;
  return (
    <NextLink
      href={href}
      className={cn(
        `${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`,
        className
      )}
    >
      {children}
    </NextLink>
  );
};

export default Link;
