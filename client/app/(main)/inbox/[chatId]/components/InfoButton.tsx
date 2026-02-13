"use client";
import { Button } from "@/components/ui/button";
import { toggleOpenRightSidebar } from "@/redux/features/conversation/conversationSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Info } from "lucide-react";
import React from "react";

const InfoButton = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(toggleOpenRightSidebar());
  };
  return (
    <Button onClick={handleClick} variant="ghost" size="icon">
      <Info className="w-5 h-5" />
    </Button>
  );
};

export default InfoButton;
