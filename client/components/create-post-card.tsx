"use client";

import { useCallback, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon, Video, Smile, Globe, Users2, Lock, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import PostFeelings from "./post-feelings";
import { toast } from "sonner";
import { EntityInput } from "./entity-form";
import { Entity } from "@/types";
import { Separator } from "../app/components/ui/separator";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../app/components/ui/responsive-dialog";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { PostPrivacy, PostType } from "@/interface/post.interface";
import { PostCreationSkeleton } from "./create-post-card-loading";
import { Session } from "next-auth";

interface ImagePreview {
  id: string;
  file: File;
  url: string;
}

export default function CreatePostCard({
  session: authSession,
  groupId,
}: {
  session?: Session;
  groupId?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [rawText, setRawText] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [showFeelingsModal, setShowFeelingsModal] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<{
    type: string;
    emoji: string;
    text: string;
  } | null>({
    type: "",
    emoji: "",
    text: "",
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        if (index > 2) {
          toast.error("Only 3 images are allowed.");
          return;
        }
        setImages((prev) => [...prev, { id, file, url }]);
      } else {
        toast.error("Only image files are allowed.");
      }
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };
  const { status, data } = useSession();

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleCreatePost = async () => {
    const res = await createPost({
      content: rawText,
      type: images.length > 0 ? PostType.IMAGE : PostType.TEXT,
      privacy: privacy as PostPrivacy,
      entities: entities.map(({ name, tag, id, ...rest }) => ({
        text: name || tag,
        target: id || tag,
        ...rest,
      })),
      group: groupId,
      feelings: selectedFeeling?.type ? selectedFeeling : null,
      attachments: images.map((img) => img.file),
    }).unwrap();

    if (res?.data?.id) {
      toast.success("Post created successfully");
      setIsDialogOpen(false);
      setEntities([]);
      setRawText("");
      setImages([]);
    } else {
      toast.error("Failed to create post", {
        description: res?.errors?.[0]?.message,
      });
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy.toLowerCase()) {
      case "public":
        return <Globe className="w-3 h-3" />;
      case "friends":
        return <Users2 className="w-3 h-3" />;
      case "private":
        return <Lock className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  function formatNames(arr: Entity[]) {
    const names = arr.map((item) => item.name || "").filter(Boolean);
    const count = names.length;

    if (count === 0) {
      return "";
    } else if (count === 1) {
      return `${selectedFeeling?.type ? "" : "is"} with ${names[0]}`;
    } else if (count === 2) {
      return `${selectedFeeling?.type ? "" : "is"} with ${names[0]} and ${
        names[1]
      }`;
    } else if (count === 3) {
      return `${selectedFeeling?.type ? "" : "is"} with ${names[0]}, ${
        names[1]
      } and ${names[2]}`;
    } else {
      const othersCount = count - 3;
      return `${selectedFeeling?.type ? "" : "is"} with ${names[0]}, ${
        names[1]
      }, ${names[2]} and ${othersCount} others`;
    }
  }

  const handleDataChange = useCallback(
    (text: string, newEntities: Entity[]) => {
      setRawText(text);
      setEntities(newEntities);
    },
    [],
  );

  if (status === "loading") {
    return <PostCreationSkeleton />;
  }

  return (
    <Card className="mb-4 gap-2 pt-3 pb-2.5">
      <CardContent className="px-4">
        <div className="flex gap-2">
          <Link
            href={`/${authSession?.user?.username || data?.user?.username}`}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  authSession?.user?.profilePicture?.url ||
                  data?.user?.profilePicture?.url ||
                  "/images/default-profile.jpeg"
                }
                alt="Your avatar"
              />
              <AvatarFallback>
                {authSession?.user?.fullName?.charAt(0) ||
                  data?.user?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <ResponsiveDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <ResponsiveDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start font-normal text-muted-foreground min-h-10 px-4 w-full flex-wrap whitespace-normal h-auto text-left border-none bg-input-color rounded-[20px]"
              >
                {rawText
                  ? rawText
                  : `What's on your mind, ${
                      authSession?.user?.fullName?.split(" ")[0] ||
                      data?.user?.fullName?.split(" ")[0]
                    }?`}
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent className="gap-0 p-0 !mt-0">
              <ResponsiveDialogHeader className="h-15 flex justify-center items-center">
                <ResponsiveDialogTitle className="text-center !text-[20px]">
                  Create Post
                </ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <Separator />
              <div className="flex gap-2 p-4 pb-0">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Your avatar"
                  />
                  <AvatarFallback>
                    {authSession?.user?.fullName?.charAt(0) ||
                      data?.user?.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm flex flex-wrap gap-1 items-center">
                    <p>{authSession?.user?.fullName || data?.user?.fullName}</p>
                    {selectedFeeling?.type && (
                      <p className="text-[13px]">
                        is {selectedFeeling?.emoji} {selectedFeeling.type}{" "}
                        {selectedFeeling.text}
                      </p>
                    )}
                    {entities.filter((e) => e.type === "mention").length > 0 &&
                      formatNames(entities.filter((e) => e.type === "mention"))}
                  </div>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="w-auto !h-6 p-1 border-none shadow-none focus-visible:ring-0 focus:ring-offset-0 focus:ring-0 focus-visible::ring-offset-0 text-sm">
                      <SelectValue className="h-6">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          {getPrivacyIcon(privacy)}
                          <span className="capitalize">{privacy}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FRIENDS">
                        <div className="flex items-center space-x-2">
                          <Users2 className="w-4 h-4" />
                          <span>Friends</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ONLY_ME">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Only me</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1">
                <EntityInput
                  value={rawText}
                  entities={entities}
                  onChange={handleDataChange}
                  placeholder={`What's on your mind, ${
                    authSession?.user?.fullName || data?.user?.fullName
                  }?`}
                  className="max-h-[200px] min-h-[50px] md:max-h-[100px] border-none focus-visible:ring-0 focus:ring-0 focus-visible:shadow-none focus-visible:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent"
                />
              </div>
              {/* Image Previews */}
              {images.length > 0 && (
                <div className="px-4">
                  <div className="max-h-80 overflow-y-auto border border-border rounded-lg">
                    <div
                      className={`grid gap-2 ${
                        images.length === 1
                          ? "grid-cols-1"
                          : images.length === 2
                            ? "grid-cols-2"
                            : images.length === 3
                              ? "grid-cols-3"
                              : "grid-cols-2"
                      }`}
                    >
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg border border-border"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 w-8 h-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity rounded-full bg-shade"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="border rounded-lg mt-2 p-2 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm font-medium mb-2 hidden md:block">
                    Add to your post
                  </p>
                  <div className="flex flex-col md:flex-row gap-2 md:justify-end w-full md:w-auto">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center cursor-pointer gap-1 hover:bg-slate-100 px-2 py-1 md:px-1 rounded-md"
                    >
                      <div className="">
                        <ImageIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <p>Photo/Video</p>
                    </div>
                    <PostFeelings
                      selectedFeeling={selectedFeeling}
                      setSelectedFeeling={setSelectedFeeling}
                      showModal={showFeelingsModal}
                      setShowModal={setShowFeelingsModal}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 pt-1">
                <Button
                  className="w-full mt-2"
                  disabled={!rawText.trim() || isLoading}
                  onClick={handleCreatePost}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </CardContent>
      <CardFooter className="px-2 border-t !pt-2">
        <div className="grid grid-cols-3 w-full ">
          <Button variant="ghost" className="rounded-none p-2 gap-1">
            <Video className="h-5 w-5 text-red-600" />
            <span>Live Video</span>
          </Button>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              fileInputRef.current?.click();
            }}
            variant="ghost"
            className="rounded-none p-2 gap-1"
          >
            <ImageIcon className="h-5 w-5 text-green-600" />
            <span>Photo/Video</span>
          </Button>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setShowFeelingsModal(true);
            }}
            variant="ghost"
            className="rounded-none p-2 gap-1"
          >
            <Smile className="h-5 w-5 text-yellow-500" />
            <span>Feeling/Activity</span>
          </Button>
        </div>
      </CardFooter>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </Card>
  );
}
