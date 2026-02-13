// import MobileNav from "@/components/MobileNav";
import { Menu, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="md:hidden size-8 flex justify-center items-center rounded-full bg-slate-100">
          <Menu size={18} />
        </div>
        <h1 className="font-semibold text-lg">Chats</h1>
      </div>
    </div>
  );
};

export default Header;
