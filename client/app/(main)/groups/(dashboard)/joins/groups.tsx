"use client";
import { useMyGroupsQuery } from "@/redux/features/group/groupApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Groups = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useMyGroupsQuery({ page, limit: 15, search: "" });
  return (
    <div className="grid md:grid-cols-2 gap-3 px-4 w-full max-w-2xl mx-auto">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-20 md:h-[100px] rounded-md bg-slate-200 animate-pulse"
          ></div>
        ))}
      {data?.data?.groups?.map((group) => (
        <div
          key={group.id}
          className="w-full rounded-md flex items-center gap-3 bg-normal p-3 shadow border"
        >
          <Image
            src={
              group.coverPhoto?.url || "/images/groups-default-cover-photo.png"
            }
            alt={group.name}
            width={80}
            height={80}
            className="md:w-[80px] md:h-[80px] w-10 h-10 aspect-square object-cover rounded-md"
          />
          <div className="leading-tight">
            <Link href={`/groups/${group.id}`}>
              <h1 className="font-semibold">{group.name}</h1>
            </Link>
            <p className="text-sm">{group.memberCount} members</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Groups;
