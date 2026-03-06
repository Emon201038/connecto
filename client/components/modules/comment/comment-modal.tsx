"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setSelectedPost } from "@/redux/features/post/postSlice";
import { Entity, IUser } from "@/types";
import { EntityInputRef } from "../../shared/form/entity-form";
import { IPost } from "@/interface/post.interface";
import { IComment } from "@/interface/comment.interfce";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { useAddCommentMutation } from "@/redux/features/comments/commentsApi";
import { toast } from "sonner";
import { useMeQuery } from "@/redux/features/auth/authApi";
import CommentModalHeader from "./comment-modal-header";
import CommentModalContent from "./comment-modal-content";
import CommentModalFooter from "./comment-modal-footer";

interface CommentModalProps {
  trigger?: React.ReactNode;
  post: IPost;
}

export default function CommentModal({ trigger, post }: CommentModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const inputRef2 = useRef<EntityInputRef>(null);

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

  const { data: session, isLoading: sessionLoading } = useMeQuery();
  const [createComment, { isLoading: creatingComment }] =
    useAddCommentMutation();

  if (sessionLoading) {
    // Optional: show a loader while the session is being fetched
    return <p>Loading...</p>;
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    if (!comment?.text)
      // TODO: validate if no text or no attatchments
      return;

    const commentObj = {
      text: comment.text,
      postId: post.id,
      entities:
        comment?.entities?.map(({ id, tag, name, ...rest }) => ({
          target: id || tag,
          text: name || tag,
          ...rest,
        })) || [],
      parent: null as string | null,
    };

    if (replyTo) {
      commentObj.parent = replyTo.commentId;
    } else {
      commentObj.parent = null;
    }
    const res = await createComment(commentObj).unwrap();

    if (res?.id) {
      setComment({ text: "", entities: [] });
      setReplyTo(null);
    } else {
      toast.error("Failed to create comment");
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
    <ResponsiveDialogContent className="flex flex-col gap-0 md:h-[100%-40px] p-0 bg-normal">
      {/* <div className="w-full h-full "> */}
      <CommentModalHeader post={post} />
      <CommentModalContent post={post} handleReplyClick={handleReplyClick} />
      <CommentModalFooter
        comment={comment}
        creatingComment={creatingComment}
        handleCommentSubmit={handleCommentSubmit}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        setComment={setComment}
      />
      {/* </div> */}
    </ResponsiveDialogContent>
  );
};
