"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Topbar = () => {
  const pathname = usePathname();
  return (
    <header className="fixed top-24 md:top-14 inset-0 z-50 shadow h-12 flex gap-3 justify-start items-center md:hidden dark:bg-[#1c1c1d] bg-white px-4 overflow-auto w-screen [&::-webkit-scrollbar]:hidden">
      {[
        {
          id: 1,
          title: "Your Feed",
          href: "/groups/feed",
        },
        {
          id: 2,
          title: "Discover",
          href: "/groups/discover",
        },
        {
          id: 3,
          title: "Your Groups",
          href: "/groups/joins",
        },
        {
          id: 4,
          title: "Create Group",
          href: "/groups/create",
        },
      ].map((i) => (
        <Link
          key={i.id}
          href={i.href}
          className={`px-3 py-1 ${
            pathname.includes(i.href) ? "bg-primary text-secondary" : "bg-shade"
          } rounded-full border border-primary/70 active:bg-primary flex-nowrap whitespace-nowrap scroll-smooth`}
        >
          {i.title}
        </Link>
      ))}
    </header>
  );
};

export default Topbar;
