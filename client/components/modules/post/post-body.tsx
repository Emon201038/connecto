"use client";
import { IPost } from "@/interface/post.interface";
import { HighlightHashtags } from "../../shared/form/highlight-hashtag";
import ImageGrid from "./post-image";

export default function PostBody({ post }: { post: IPost }) {
  return (
    <>
      <div className="p-3">
        <HighlightHashtags text={post.content} />
      </div>

      {post.type === "IMAGE" &&
        post.attachments &&
        post.attachments.length > 0 && (
          <ImageGrid attachments={post.attachments} />
        )}
    </>
  );
}
