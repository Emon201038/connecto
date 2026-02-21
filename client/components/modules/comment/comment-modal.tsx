"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostComments from "./comments";
import timeAgo from "@/lib/time-ago";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedPost } from "@/redux/features/post/postSlice";
import { reactionEmojis } from "@/constants/emoji";
import { Entity, IUser } from "@/types";
import { EntityInput, EntityInputRef } from "../../entity-form";
import { Button } from "@/components/ui/button";
import { Camera, Loader, SendHorizontal, Smile, SmilePlus } from "lucide-react";
import { IPost } from "@/interface/post.interface";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import { IComment } from "@/interface/comment.interfce";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { useAddCommentMutation } from "@/redux/features/comments/commentsApi";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/redux/features/auth/authApi";

interface CommentModalProps {
  trigger?: React.ReactNode;
  post: IPost;
}

export default function CommentModal({
  trigger,
  post: rootPost,
}: CommentModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const inputRef2 = useRef<EntityInputRef>(null);

  const { data } = useGetPostsQuery(
    { page: 1, limit: 15 },
    {
      skip: true,
    },
  );

  const posts = data?.data.posts || [];
  const post = posts.find((p) => p.id === rootPost.id) || rootPost;

  useEffect(() => {
    if (openModal && inputRef2.current) {
      inputRef2.current?.focus();
    }
  }, []);

  const dispatch = useAppDispatch();

  return (
    <ResponsiveDialog
      open={openModal}
      onOpenChange={(prev) => {
        setOpenModal(prev);
        if (!prev) {
          dispatch(setSelectedPost({ postId: null }));
        }
      }}
    >
      <ResponsiveDialogTrigger asChild>
        {trigger || "Comment"}
      </ResponsiveDialogTrigger>
      <CommentsContent post={post} />
    </ResponsiveDialog>
  );
}

const CommentsContent = ({ post }: { post: IPost }) => {
  const [comment, setComment] = useState<{
    text: string;
    entities: Entity[];
  }>();
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    author: IComment["author"];
  } | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const session = useSession();
  const [createComment, { isLoading: creatingComment }] =
    useAddCommentMutation();
  const { data } = useMeQuery(
    void {
      skip: session.status === "loading",
    },
  );

  if (session.status === "loading") {
    // Optional: show a loader while the session is being fetched
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated" && !session.data) {
    // Optional: user is not logged in
    // router.refresh();
    // window.location.reload();
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    if (!comment?.text)
      // TODO: validate if no text or no attatchments
      return;

    const commentObj: {
      text: string | null;
      post: string;
      author: string;
      parent: string | null;
      entities: Entity[];
    } = {
      text: comment.text,
      post: post.id,
      author: session?.data?.user?.id as string,
      parent: null,
      entities:
        comment?.entities?.map(({ id, tag, name, ...rest }) => ({
          target: id || tag,
          text: name || tag,
          ...rest,
        })) || [],
    };

    if (replyTo) {
      commentObj.parent = replyTo.commentId;
    }
    const res = await createComment(commentObj).unwrap();

    if (res?.data?.id) {
      setComment({ text: "", entities: [] });
      setReplyTo(null);
    } else {
      toast.error("Failed to create comment", {
        description: res?.errors?.[0]?.message,
      });
    }
  };

  const handleReplyClick = (commentId: string, author: IUser) => {
    setReplyTo({ commentId, author });
    const editableDiv = inputRef.current;
    if (editableDiv) {
      editableDiv.innerHTML = `<span class="text-primary font-medium bg-[#c2d6f7] " contenteditable="false">@${author.fullName}</span>&nbsp;`;

      editableDiv.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableDiv);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <ResponsiveDialogContent className="flex flex-col gap-0 overflow-auto md:h-[100%-40px] p-0 bg-normal">
      <ResponsiveDialogHeader className="hidden md:block p-4 border-b text-center relative">
        <ResponsiveDialogTitle className="w-full text-center">
          {post?.author?.fullName}&apos;s Post
        </ResponsiveDialogTitle>
      </ResponsiveDialogHeader>
      <ResponsiveDialogDescription> </ResponsiveDialogDescription>
      <div className="overflow-auto flex-1">
        <div className="p-4 pb-3 gap-2 items-center hidden md:flex">
          <Link href={`/${post?.author?.username}`} className="shrink-0">
            <Avatar>
              <AvatarImage
                src={
                  post.author?.profilePicture?.url ||
                  "/images/default-profile.jpeg"
                }
                alt={post?.author?.fullName}
              />
              <AvatarFallback>
                {post?.author?.fullName?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 flex flex-col justify-center">
            <Link
              href={`/${post?.author?.username}`}
              className="font-medium text-sm"
            >
              {post?.author?.fullName}
            </Link>
            <span className="text-xs text-muted-foreground">
              {timeAgo(Number(post.createdAt))}
            </span>
          </div>
        </div>
        <div className="px-4 pb-3 hidden md:block">
          <p>{post.content}</p>
        </div>

        {post?.attachments &&
          post.attachments.map((a) => (
            <div key={a.pub_id} className="bg-gray-200 hidden md:block">
              <Image
                src={a.url || "/placeholder.svg"}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        <div className="px-4 py-2 border-b hidden md:block">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-full  text-white">
                {post?.reactionSummary?.length &&
                post?.reactionSummary?.length > 0
                  ? [...post.reactionSummary]
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3)
                      .map((reaction, index) => (
                        <div
                          key={reaction.reactionType}
                          className={`relative`}
                          style={{
                            marginLeft: index > 0 ? "-4px" : "0",
                            zIndex: 3 - index,
                          }}
                        >
                          {reactionEmojis[reaction.reactionType].emoji}
                        </div>
                      ))
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className="md:border-t h-full overflow-auto">
          <PostComments post={post} onReply={handleReplyClick} />
        </div>
      </div>
      <div className="p-4 pb-0 border-t w-full overflow-auto">
        {replyTo && (
          <div className="text-xs opacity-50 flex items-center gap-1">
            <p>
              Replying to{" "}
              {replyTo?.author.id === session?.data?.user?.id
                ? "yourself"
                : replyTo.author.fullName}{" "}
              .{" "}
            </p>
            <button onClick={() => setReplyTo(null)}> Cancel</button>
          </div>
        )}
        <EntityInput
          value={comment?.text || ""}
          entities={comment?.entities || []}
          onChange={(text, entities) => {
            setComment({ text, entities });
          }}
          // ref={inputRef2}
          // onSubmit={() => alert("form is submitted")}
          placeholder={"Comment as " + session?.data?.user?.fullName}
          className="min-h-15 p-2 pb-7 border rounded-lg focus:outline-0 focus:ring-0 focus:border-transparent text-sm font-primary dark:text-[rgb(226,229,233)] tracking-tighter"
        >
          <div className="relative w-full h-full ">
            <div className="absolute bottom-1 right-0 w-full opacity-60 px-1">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-0 items-center relative">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    data-title="Insert an emoji"
                    dir="top"
                    className={`rounded-full flex items-center size-7 tooltip
                      `}
                  >
                    <Smile />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    data-title="Attach a photo or video"
                    dir="top"
                    className={`rounded-full flex items-center size-7 tooltip
                      `}
                  >
                    <Camera />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    data-title="Comment as a gif"
                    dir="top"
                    className={`rounded-full flex items-center size-7 tooltip
                      `}
                  >
                    <SmilePlus />
                  </Button>
                </div>
                <Button
                  onClick={handleCommentSubmit}
                  variant={"ghost"}
                  size={"sm"}
                  data-title="Comment"
                  data-position="top"
                  disabled={!comment?.text || creatingComment}
                  className={`rounded-full flex items-center size-7 tooltip ${
                    !!comment?.text ? "cursor-pointer" : "cursor-not-allowed"
                  }
                      `}
                >
                  {creatingComment ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <SendHorizontal />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </EntityInput>
      </div>
    </ResponsiveDialogContent>
  );
};
