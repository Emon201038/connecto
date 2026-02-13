import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Photos</h3>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((url, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 rounded-md overflow-hidden"
          >
            <Image
              src={"/images/default-profile.jpeg"}
              alt={`Photo-${index}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default page;
