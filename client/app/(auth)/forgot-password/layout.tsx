import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Forgotten Password | Can't Login? | Connecto",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="sticky top-0 z-50 px-4 h-12 w-full flex justify-between items-center bg-accent">
        <Image
          src={"/images/connecto-full-logo.png"}
          width={125}
          height={32}
          alt="Logo"
          priority
        />
        {/* <h1 className="text-blue-600 text-lg font-bold">facebook</h1> */}
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
      {children}
    </>
  );
};

export default layout;
