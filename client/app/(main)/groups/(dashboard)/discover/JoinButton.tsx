"use client";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/redux/features/group/groupApi";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const JoinButton = ({ groupId }: { groupId: string }) => {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();

  const handleJoin = async () => {
    try {
      const res = await joinGroup({ groupId }).unwrap();
      console.log(res);
      toast.success("Success!!!", {
        description: `Joined ${res.data.name} group successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={handleJoin}
      disabled={isLoading}
      variant={"secondary"}
      className="w-full"
    >
      {isLoading && <Loader className="animate-spin" />} Join Group
    </Button>
  );
};

export default JoinButton;
