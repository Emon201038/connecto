"use client";
import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Link = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const [isMatches, setIsMatches] = React.useState(false);
  React.useEffect(() => {
    setIsMatches(pathname === href);
  }, [pathname, href]);
  return (
    <NextLink
      href={href}
      className={cn(
        "rounded-none px-4 py-2   border-b-2 h-full",
        isMatches ? " border-blue-600 text-blue-600" : "border-transparent",
        className
      )}
    >
      {children}
    </NextLink>
  );
};

export default Link;
