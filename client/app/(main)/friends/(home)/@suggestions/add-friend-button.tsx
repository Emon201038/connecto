"use client";
import { Button } from "@/components/ui/button";
import {
  useDeleteFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/redux/features/friend/friendApi";
import { Loader, Trash2, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

const AddFriendButton = ({ userId }: { userId: string }) => {
  const [isSent, setIsSent] = React.useState(false);

  const [sendFriendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();
  const [deleteFriendRequest, { isLoading: isDeleting }] =
    useDeleteFriendRequestMutation();

  const handleClick = async () => {
    try {
      if (isSent) {
        await deleteFriendRequest({ requestId: userId });
        setIsSent(false);
      } else {
        await sendFriendRequest({ recipientId: userId });
        setIsSent(true);
      }
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };
  return (
    <Button
      disabled={isSending || isDeleting}
      onClick={handleClick}
      size="sm"
      className="flex-1 w-auto md:w-full gap-0"
    >
      {isSent && (!isSending || !isDeleting) ? (
        <Trash2 className="w-4 h-4 mr-10.5" />
      ) : (
        <UserPlus className="w-4 h-4 mr-0.5" />
      )}
      {isSending || isDeleting ? (
        <Loader className="w-4 h-4 mr-1 animate-spin" />
      ) : null}
      {isSent ? "Cancel" : "Add Friend"}
    </Button>
  );
};

export default AddFriendButton;
