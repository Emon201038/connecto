import React from "react";
import GroupCreateForm from "./group-form";
import GroupPreview from "./group-preview";
import Wrapper from "./wrapper";

export const metadata = {
  title: "Create Group",
};
const page = () => {
  return (
    <div
      // style={{ height: "calc(100vh - 96px)", minHeight: "calc(100vh - 96px)" }}
      className="h-[calc(100vh-96px)] min-h-[calc(100vh-96px)] md:h-[calc(100vh-56px)]"
    >
      <Wrapper />
    </div>
  );
};

export default page;
