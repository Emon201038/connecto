import { Separator } from "@/components/ui/separator";
import React from "react";
import Groups from "./groups";

const GroupJoinsPage = () => {
  return (
    <div className="mt-12 md:mt-0 bg-muted w-full ">
      <h1 className="p-4 w-full max-w-2xl mx-auto">
        All groups you have joined
      </h1>
      <Groups />
    </div>
  );
};

export default GroupJoinsPage;
