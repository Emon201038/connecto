import { IconProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import React from "react";

const HomeIcon: React.FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg className={cn("size-8", className)} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" id="home">
      <path d="M4 0L0 3h1v4h2V5h2v2h2V2.97L8 3 4 0z"></path>
    </svg>
  );
};

export default HomeIcon;
