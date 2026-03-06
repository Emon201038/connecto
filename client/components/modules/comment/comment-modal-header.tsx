import {
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { IPost } from "@/interface/post.interface";
import React from "react";

const CommentModalHeader = ({ post }: { post: IPost }) => {
  return (
    <>
      <ResponsiveDialogHeader className="hidden md:block p-4 border-b text-center relative">
        <ResponsiveDialogTitle className="w-full text-center">
          {post?.author?.fullName}&apos;s Post
        </ResponsiveDialogTitle>
      </ResponsiveDialogHeader>
      <ResponsiveDialogDescription> </ResponsiveDialogDescription>
    </>
  );
};

export default CommentModalHeader;
