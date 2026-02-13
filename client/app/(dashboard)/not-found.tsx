"use client";
import Image from "next/image";
import React from "react";
import notFoundImage from "@/../public/images/not-found.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="w-full h-[calc(100vh_-_96px)] md:h-[calc(100vh_-_54px)] flex flex-col justify-center items-center  ">
      <div className="max-w-lg text-center flex flex-col justify-center items-center">
        <Image src={notFoundImage} alt="404" width={112} height={112} />
        <h2 className="text-2xl font-bold text-muted-foreground mt-6 mb-3">
          This content isn&apos;t available at the moment
        </h2>
        <p className="text-lg">
          When this happens, it&apos;s usually because the owner only shared it
          with a small group of people or changed who can see it, or it&apos;s
          been deleted.
        </p>
        <Link
          href="/"
          className="mt-4 bg-primary py-2 px-4 text-primary-foreground rounded-md font-semibold text-lg"
        >
          Go to Feed
        </Link>
        <Button
          onClick={handleBack}
          className="mt-4 cursor-pointer"
          variant={"outline"}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
