"use client";
import { Button } from "@/components/ui/button";
import {
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
} from "@/redux/features/friend/friendApi";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const AcceptButton = ({ id }: { id: string }) => {
  const [acceptFriendRequest, { isLoading: isSending }] =
    useAcceptFriendRequestMutation();
  const [isAccepted, setIsAccepted] = React.useState(false);

  const handleAccept = async () => {
    try {
      await acceptFriendRequest({ requestId: id }), {};
      setIsAccepted(true);
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };
  return (
    <Button
      onClick={handleAccept}
      disabled={isAccepted || isSending}
      className="flex-1 w-auto md:w-full"
    >
      {isSending ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Plese wait
        </>
      ) : isAccepted ? (
        "Confirmed"
      ) : (
        "Confirm"
      )}
    </Button>
  );
};
export const DeclineButton = ({ id }: { id: string }) => {
  const [deleteFriendRequest, { isLoading: isSending }] =
    useDeleteFriendRequestMutation();
  const [isDeclined, setIsDeclined] = React.useState(false);

  const handleAccept = async () => {
    try {
      await deleteFriendRequest({ requestId: id });
      setIsDeclined(true);
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline friend request");
    }
  };
  return (
    <Button
      onClick={handleAccept}
      disabled={isDeclined || isSending}
      variant={"outline"}
      className="flex-1 w-auto md:w-full"
    >
      {isSending ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Plese wait
        </>
      ) : isDeclined ? (
        "Deleted"
      ) : (
        "Delete"
      )}
    </Button>
  );
};
