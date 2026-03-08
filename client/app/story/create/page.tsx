"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import GridIcon from "@/components/icons/GridIcon";
import { ProfilePopover } from "@/components/profile-popover";
import ReusableTooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Profile from "./profile";
import { cn } from "@/lib/utils";
import { useCreateStoryMutation } from "@/redux/features/story/storyApi";
import { STORY_BACKGROUNDS } from "@/constants/themes";

import {
  ALargeSmall,
  Bell,
  CaseSensitive,
  Images,
  Settings,
  X,
} from "lucide-react";
import { Header } from "@/components/modules/story/create/header";
import { LeftSidebar } from "@/components/modules/story/create/left-sidebar";
import { MainContent } from "@/components/modules/story/create/main-content";

type Position = { x: number; y: number };

const CreateStoryPage = () => {
  const [image, setImage] = useState<File>();
  const [isEditing, setIsEditing] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(STORY_BACKGROUNDS[0]);
  const [inputText, setInputText] = useState("");
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const dragging = useRef(false);
  const start = useRef<Position>({ x: 0, y: 0 });
  const parentRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Center editor when entering text mode
  useLayoutEffect(() => {
    if (!isEditing || !isTextMode || !editorRef.current || !parentRef.current)
      return;
    const parentRect = parentRef.current.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setPosition({
      x: (parentRect.width - editorRect.width) / 2,
      y: (parentRect.height - editorRect.height) / 2,
    });

    editorRef.current.focus();
  }, [isEditing, isTextMode]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!inputText.trim()) return;
    dragging.current = true;
    start.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !parentRef.current) return;

    const rect = parentRef.current.getBoundingClientRect();
    let x = e.clientX - start.current.x;
    let y = e.clientY - start.current.y;

    x = Math.max(0, Math.min(x, rect.width - 100));
    y = Math.max(0, Math.min(y, rect.height - 40));

    setPosition({ x, y });
  }, []);

  const handleMouseUp = () => (dragging.current = false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  const handleClick = (id: number) => {
    if (id === 2) {
      setIsEditing(true);
      setIsTextMode(true);
      setInputText("");
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setIsTextMode(false);
    setImage(undefined);
    setInputText("");
  };

  const handleCreate = () => {};

  const storyOptions = useMemo(
    () => [
      { id: 1, title: "Create a photo story", icon: Images },
      { id: 2, title: "Create a text story", icon: ALargeSmall },
    ],
    [],
  );

  return (
    <div className="w-full h-screen">
      <Header />
      <Separator className="w-90! fixed top-14 md:block hidden" />
      <div className="flex w-full h-full">
        <LeftSidebar
          isEditing={isEditing}
          isTextMode={isTextMode}
          image={image}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          inputText={inputText}
          onDiscard={handleDiscard}
          onCreate={handleCreate}
        />
        <MainContent
          isEditing={isEditing}
          isTextMode={isTextMode}
          image={image}
          position={position}
          rotation={rotation}
          parentRef={parentRef}
          editorRef={editorRef}
          inputText={inputText}
          setInputText={setInputText}
          handleMouseDown={handleMouseDown}
          storyOptions={storyOptions}
          handleClick={handleClick}
          onDiscard={handleDiscard}
          onCreate={handleCreate}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => {
          setImage(e.target.files?.[0]);
          setIsEditing(true);
        }}
      />
    </div>
  );
};

export default CreateStoryPage;
