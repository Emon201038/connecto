"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import timeAgo from "@/lib/time-ago";
import { IPost } from "@/interface/post.interface";
import PostDropdown from "./post-dropdown";

export default function PostHeader({ post }: { post: IPost }) {
  return (
    <div className="p-3 flex gap-2">
      {post?.group ? (
        <div className="shrink-0 relative">
          <Link href={`/groups/${post.group.id}`}>
            <i
              style={{
                backgroundImage: `url(${
                  post.group?.coverPhoto?.url ||
                  process.env.NEXT_PUBLIC_CLIENT_URL +
                    "/images/groups-default-cover-photo.png"
                })`,
                width: "36px",
                height: "36px",
                backgroundSize: "cover",
                display: "inline-block",
                borderRadius: "5px",
              }}
            />
          </Link>

          <Link
            href={`/${post.author.username}`}
            className="absolute bottom-0 -right-1"
          >
            <Avatar className="size-6">
              <AvatarImage
                src={
                  post.author.profilePicture?.url ||
                  "/images/default-profile.jpeg"
                }
              />
              <AvatarFallback>
                {post.author.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      ) : (
        <Link href={`/${post.author.username}`} className="shrink-0">
          <Avatar>
            <AvatarImage
              src={
                post.author.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
            />
            <AvatarFallback>
              {post.author.fullName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {post?.group ? (
          <>
            <Link href={`/groups/${post.group.id}`} className="font-semibold">
              {post.group.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {post.author.fullName} · {timeAgo(Number(post.createdAt))}
            </span>
          </>
        ) : (
          <>
            <Link
              href={`/${post.author.username}`}
              className="font-semibold text-xs"
            >
              {post.author.fullName}
            </Link>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.createdAt)}
            </span>
          </>
        )}
      </div>

      <PostDropdown post={post} />
    </div>
  );
}
