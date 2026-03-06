import { EntityInput } from "@/components/shared/form/entity-form";
import { Button } from "@/components/ui/button";
import { useMeQuery } from "@/redux/features/auth/authApi";
import { Camera, Loader, SendHorizontal, Smile, SmilePlus } from "lucide-react";
import React from "react";

type Props = {
  replyTo: any;
  setReplyTo: any;
  comment: any;
  setComment: any;
  handleCommentSubmit: any;
  creatingComment: any;
};

const CommentModalFooter = ({
  replyTo,
  setReplyTo,
  comment,
  setComment,
  handleCommentSubmit,
  creatingComment,
}: Props) => {
  const { data: session } = useMeQuery();
  return (
    <div className="p-4 md:pb-0 border-t w-full opacity-100 sticky bottom-0 md:-bottom-px left-0 bg-normal z-1000">
      {replyTo && (
        <div className="text-xs opacity-50 flex items-center gap-1">
          <p>
            Replying to{" "}
            {replyTo?.author.id === session?.id
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
        onSubmit={() => handleCommentSubmit()}
        placeholder={"Comment as " + session?.fullName}
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
                  className={`rounded-full flex items-center size-7 tooltip`}
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
                dir="top"
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
  );
};

export default CommentModalFooter;
