"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Share,
  ThumbsUp,
} from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Tooltip from "../../Tooltip";
import timeAgo from "@/lib/time-ago";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedPost } from "@/redux/features/post/postSlice";
import { Separator } from "@/components/ui/separator";
import CommentModal from "../comment/comment-modal";
import { IPost } from "@/interface/post.interface";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import { HighlightHashtags } from "../../highlight-hashtag";
import { ReactionButton2 } from "../../reaction-button-2";
import { useTogglePostReactionMutation } from "@/redux/features/reaction/reactionApi";
import { ReactionType } from "@/interface/reaction.interface";
import { toast } from "sonner";
import { ShareModal } from "../share/share-modal";
import { reactions as allReact } from "@/constants/reactions";
import ImageGrid from "./post-image";

export default function PostCard({ post: rootPost }: { post: IPost }) {
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isFetchingCommenters, setIsFetchingCommenters] = useState(false);
  const [commenters, setCommenters] = useState<
    { id: string; fullName: string }[]
  >([]);
  const [reactions, setReactions] = useState<
    {
      userId: { id: string; fullName: string; profilePicture: { url: string } };
      reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
    }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { data } = useGetPostsQuery(
    { page: 1, limit: 15 },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    },
  );
  const post = data?.data.posts.find((p) => p.id === rootPost.id) || rootPost;

  const [toggleReaction] = useTogglePostReactionMutation();

  const openReportModal = (post: IPost) => {
    // setReportingPost(post);
    setMoreDropdownOpen(false);
  };

  const handleGetCommenters = () => {
    setIsFetchingCommenters(true);
    setTimeout(() => {
      setIsFetchingCommenters(false);
      setCommenters([
        { id: "1", fullName: "Emdadul Hoque" },
        { id: "2", fullName: "Nasim Khan" },
        { id: "3", fullName: "Sabbir" },
      ]);
    }, 2000);
  };
  const handleGetReactors = () => {};

  const handleReactionChange = async (reaction: ReactionType) => {
    try {
      await toggleReaction({
        target: post.id,
        targetType: "Post",
        type: reaction,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to react");
    }
  };

  const handleReactionClick = async () => {
    if (post.myReaction) {
      handleReactionChange(post.myReaction.type as ReactionType);
    } else {
      handleReactionChange("LIKE" as ReactionType);
    }
  };

  return (
    <Card
      id={"post-" + post.id.toString()}
      key={post.id}
      className=" p-0 gap-0"
    >
      <div className="p-3 flex gap-2">
        {post?.group && (
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
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
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
                  alt={post.author.fullName}
                />
                <AvatarFallback>
                  {post.author.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
        {!post?.group && (
          <Link href={`/${post.author.username}`} className="shrink-0">
            <Avatar>
              <AvatarImage
                src={
                  post.author.profilePicture?.url ||
                  "/images/default-profile.jpeg"
                }
                alt={post.author.fullName}
              />
              <AvatarFallback>
                {post.author.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div className="flex-1 flex flex-col justify-center">
          {post?.group ? (
            <div className="flex flex-col gap-0 leading-2 mt-1">
              <div className="flex gap-2 items-center">
                <Link
                  href={`/groups/${post.group.id}`}
                  className="font-semibold"
                >
                  {post.group.name}
                </Link>
                {!post?.group?.joined && (
                  <div className="text-primary font-semibold text-sm cursor-pointer">
                    Join
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Link
                  href={`/${post.author.username}`}
                  className="text-xs text-muted-foreground"
                >
                  {post.author.fullName}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(Number(post.createdAt))}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0 leading-0">
              <div className="flex flex-wrap gap-1 font-semibold text-xs">
                <Link href={`/${post.author.username}`}>
                  {post.author.fullName}
                </Link>
                {(post as any)?.feelingsType && (
                  <span>
                    is {(post as any)?.feelingsEmoji}{" "}
                    {(post as any)?.feelingsType} {(post as any)?.feelingsText}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          )}
        </div>
        <DropdownMenu
          open={moreDropdownOpen}
          onOpenChange={setMoreDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openReportModal(post)}>
              Report post
            </DropdownMenuItem>
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
            <DropdownMenuItem>Unfollow {post.author.fullName}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-3">
        <HighlightHashtags text={post.content} />
      </div>
      {post.type === "image" &&
        post.attachments &&
        post.attachments.length > 0 && (
          <ImageGrid attachments={post.attachments} />
        )}
      <CardFooter className="flex flex-col items-start p-2 pt-0">
        <div className="flex w-full justify-between px-2 py-1 text-sm text-muted-foreground">
          <div
            onClick={() => setShowModal(true)}
            onMouseEnter={() => handleGetReactors()}
            className="flex justify-between items-center gap-1 cursor-pointer"
          >
            {!isMobile ? (
              <Tooltip
                content={
                  <div className="flex items-center justify-center">
                    {false ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <div className="flex flex-col items-start">
                        {reactions.map((reaction, index) => (
                          <span key={index} className="text-xs">
                            {reaction.userId.fullName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                }
              >
                <div className="flex gap-1">
                  <div className="flex items-center justify-center rounded-full  text-white">
                    {post.reactionSummary && post?.reactionSummary.length > 0
                      ? [...(post.reactionSummary as any)]
                          .sort((a, b) => b._count.type - a._count.type)
                          .slice(0, 3)
                          .map((reaction, index) => {
                            const targetedReact = allReact.find(
                              (r) => r.type === reaction.type,
                            );

                            console.log(post.reactionSummary);
                            return (
                              <div
                                key={reaction.type}
                                className={`relative`}
                                style={{
                                  marginLeft: index > 0 ? "-4px" : "0",
                                  zIndex: 3 - index,
                                }}
                              >
                                <Image
                                  src={targetedReact?.src || "/images/like.svg"}
                                  alt={targetedReact?.name || "react"}
                                  width={16}
                                  height={16}
                                  priority
                                />
                              </div>
                            );
                          })
                      : null}
                  </div>
                  <p
                    className={`${(post as any)._count.reactions ? "block" : "hidden"}`}
                  >
                    {(post as any)._count.reactions}
                  </p>
                </div>
              </Tooltip>
            ) : (
              <button className="hover:underline flex gap-1">
                <div
                  // style={{
                  //   backgroundColor: post.myReaction
                  //     ? reactionEmojis[post.myReaction.type].bg
                  //     : "white",
                  // }}
                  className="flex items-center justify-center rounded-full"
                >
                  {post.reactionSummary && post.reactionSummary.length > 0
                    ? [...post.reactionSummary.filter((r) => r.count > 0)]
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3)
                        .map((reaction, index) => {
                          const targetedReact = allReact.find(
                            (r) => r.type === (reaction as any).type,
                          );
                          return (
                            <div
                              key={(reaction as any).type}
                              className={`relative`}
                              style={{
                                marginLeft: index > 0 ? "-4px" : "0",
                                zIndex: 3 - index,
                              }}
                            >
                              <Image
                                src={targetedReact?.src || "images/like.svg"}
                                alt={targetedReact?.name || "like"}
                                width={16}
                                height={16}
                                priority
                              />
                            </div>
                          );
                        })
                    : null}
                </div>
                <p
                  className={`${(post as any)._count.reactions > 0 ? "block" : "hidden"}`}
                >
                  {(post as any)._count.reactions}
                </p>
              </button>
            )}
          </div>
          <div
            onClick={() => dispatch(setSelectedPost({ postId: post.id }))}
            onMouseEnter={() => handleGetCommenters()}
            className="flex gap-4"
          >
            {!isMobile ? (
              <Tooltip
                content={
                  <div className="flex items-center justify-center">
                    {isFetchingCommenters && commenters?.length === 0 ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {commenters?.length > 0 ? (
                      <div className="flex flex-col  justify-center items-start">
                        {commenters?.map((commenter) => (
                          <span key={commenter.id} className="text-xs">
                            {commenter.fullName}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                }
              >
                <button className="hover:underline">
                  {(post as any)._count.comments} comments
                </button>
              </Tooltip>
            ) : (
              <button className="hover:underline">
                {(post as any)._count.comments} comments
              </button>
            )}
            <button className="hover:underline">
              {(post as any)._count.shares} shares
            </button>
          </div>
          {/* {showModal && (
              <ReactorsModal
                postID={post.id}
                onClose={() => setShowModal(false)}
              />
            )} */}
        </div>
        <Separator className="my-1 w-full" />
        <div className="grid grid-cols-3 w-full">
          {/* <ReactionButton post={post} /> */}
          <ReactionButton2
            onReaction={(e) =>
              handleReactionChange(e?.toUpperCase() as ReactionType)
            }
            handleButtonClick={handleReactionClick}
            className="w-full"
          >
            <div className="w-full p-1 flex justify-center items-center gap-2">
              {post.myReaction ? (
                <Image
                  src={
                    allReact.find((r) => r.type === post?.myReaction?.type)
                      ?.src || "images/like.svg"
                  }
                  alt={"react"}
                  width={16}
                  height={16}
                  priority
                />
              ) : (
                <ThumbsUp />
              )}
              {post.myReaction ? (
                <p
                  style={{
                    color: allReact.find(
                      (r) => r.type === post?.myReaction?.type,
                    )?.text,
                  }}
                >
                  {
                    allReact.find((r) => r.type === post?.myReaction?.type)
                      ?.name
                  }
                </p>
              ) : (
                <p>Like</p>
              )}
            </div>
          </ReactionButton2>
          <CommentModal
            post={post}
            trigger={
              <Button
                variant={"ghost"}
                className="flex items-center justify-center gap-1 w-full"
                onClick={() => dispatch(setSelectedPost({ postId: post.id }))}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Comment</span>
              </Button>
            }
          />
          <ShareModal open={showShareModal} onOpenChange={setShowShareModal} />
          <Button
            variant={"ghost"}
            className="flex items-center justify-center gap-1 w-full"
            onClick={() => setShowShareModal((prev) => !prev)}
          >
            <Share className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
