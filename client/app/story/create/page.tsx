"use client";
import GridIcon from "@/components/icons/GridIcon";
import { ProfilePopover } from "@/components/profile-popover";
import ReusableTooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ALargeSmall,
  Bell,
  CaseSensitive,
  Images,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { toast } from "sonner";
import Profile from "./profile";
import { cn } from "@/lib/utils";
import { useCreateStoryMutation } from "@/redux/features/story/storyApi";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STORY_BACKGROUNDS } from "@/constants/themes";

const CreateStoryPage = () => {
  const [image, setImage] = React.useState<File>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isTextMode, setIsTextMode] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(
    STORY_BACKGROUNDS[0],
  );
  const [inputText, setInputText] = React.useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (id: number) => {
    if (id === 2) {
      // toast.info("This feature is not available yet.");
      setIsEditing(true);
      setIsTextMode(true);
    } else {
      // const inputField = document.createElement("input");
      // inputField.type = "file";
      // inputField.accept = "image/*";
      // inputField.click();
      // inputField.onchange = () => {
      //   const file = inputField.files?.[0];
      //   if (file) {
      //     setImage(file);
      //   } else {
      //     setIsEditing(false);
      //   }
      // };
      fileInputRef.current?.click();
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setIsTextMode(false);
    setImage(undefined);
  };
  const handleCreate = () => {};

  return (
    <div className="w-full h-screen">
      {/* header */}
      <header className="flex justify-between items-center gap-2 h-14 px-4 fixed top-0 left-0 w-full bg-transparent z-10">
        <div className="flex gap-3 items-center">
          <Link
            href={"/"}
            className="size-10 bg-muted flex justify-center items-center rounded-full cursor-pointer"
          >
            <X />
          </Link>
          <Link
            href={"/"}
            className="size-10 bg-[#0274f9] flex justify-center items-center rounded-full cursor-pointer"
          >
            <Image
              width={30}
              height={30}
              alt="logo"
              src={"/images/connecto-short-logo.png"}
            />
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <ReusableTooltip content="Menu">
            <div className="size-10 rounded-full bg-secondary-btn-bg flex justify-center items-center cursor-pointer">
              <GridIcon className="size-6 text-secondary-btn-text" />
            </div>
          </ReusableTooltip>
          <ReusableTooltip content="Messenger">
            <div className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center">
              {/* <Link href="/inbox"> */}
              <Bell fill="currentColor" size={24} />
              {/* </Link> */}
            </div>
          </ReusableTooltip>
          <ReusableTooltip content="Account">
            <div>
              {/* <ProfileDropdown /> */}
              <ProfilePopover />
            </div>
          </ReusableTooltip>
        </div>
      </header>
      <Separator className="w-90! fixed top-14 md:block hidden" />
      <div className="flex w-full h-full">
        {/* left sidebar */}
        <div className="w-90 h-full shadow-[1px_0px_12px_-4px_rgba(0,0,0,0.3)] hidden md:block relative bg-normal">
          <div className="w-full mt-16 ">
            <div className="flex justify-between items-center w-full p-4">
              <h1 className="font-bold text-2xl">Your Story</h1>
              <Button
                className="size-9 rounded-full bg-secondary-btn-bg text-secondary-btn-text"
                variant={"ghost"}
              >
                <Settings />
              </Button>
            </div>
            <Profile />
            <Separator />
            {image && (
              <div className="px-4 py-2 flex justify-start items-center gap-3 cursor-pointer hover:bg-muted/70 mx-4 my-2 rounded-sm">
                <div className="size-10 rounded-full flex justify-center items-center bg-secondary-btn-bg text-secondary-btn-text">
                  <ALargeSmall />
                </div>
                <h1 className="text-lg font-bold">Add Text</h1>
              </div>
            )}
            {isTextMode && (
              <div className="p-4 w-full space-y-4">
                <Select>
                  <SelectTrigger className="w-full h-14! justify-start gap-2">
                    <CaseSensitive />
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                </Select>

                <div className="border rounded-md p-4">
                  <h1>Backgrounds</h1>
                  <p className="text-sm opacity-50 mt-2">Gradient</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {STORY_BACKGROUNDS.filter(
                      (bg) => bg.type === "gradient",
                    ).map((bg) => (
                      <div
                        key={bg.id}
                        className="size-8 rounded-full flex justify-center items-center cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${bg!.colors!.join(",")})`,
                          border:
                            bg.id === selectedColor.id
                              ? "4px solid #0274f9"
                              : "",
                          scale: bg.id === selectedColor.id ? "1.2" : "1",
                        }}
                        onClick={() => setSelectedColor(bg)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {isEditing && (
            <Footer
              onDiscard={handleDiscard}
              onCreate={handleCreate}
              className="fixed bottom-0 left-0 w-90 shadow-[0px_1px_12px_-4px_rgba(0,0,0,0.3)] p-3"
            />
          )}
        </div>

        <div className="flex-1  bg-shade">
          {isEditing ? (
            <div className="  h-[calc(100vh-3.5rem)] mt-14 mb-6 flex flex-col justify-center items-center px-8 md:py-8 py-4">
              <div className="rounded-md shadow-[1px_1px_12px_-4px_rgba(0,0,0,0.3)] w-full h-full p-4 flex flex-col gap-3">
                <p className="text-left w-full">Preview</p>
                <div className="flex-1 rounded-md shadow-[1px_1px_12px_-4px_rgba(0,0,0,0.3)] bg-[#18191a] p-3 flex justify-center items-center">
                  <div className="w-full h-full relative border rounded-sm">
                    {image && !isTextMode && (
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="logo"
                        fill
                        className="w-full aspect-2/3 h-full object-contain z-10"
                      />
                    )}
                    {isTextMode && (
                      <div className="w-full h-full flex justify-center items-center py-6 overflow-auto">
                        {/* user-select: text; white-space: pre-wrap; word-break: break-word; color: var(--always-white); font-size: 15.8452px; */}
                        <div
                          className="w-75! border h-full flex relative justify-center items-center "
                          style={{
                            background:
                              selectedColor.type === "gradient"
                                ? `linear-gradient(135deg, ${selectedColor.colors!.join(",")})`
                                : selectedColor.color,
                          }}
                        >
                          <p
                            className="absolute font-bold opacity-50 z-10"
                            style={{
                              display: inputText.trim() ? "none" : "block",
                            }}
                          >
                            Start typing
                          </p>
                          <div
                            className="focus:outline-none select-text whitespace-pre-wrap wrap-break-word max-w-[90%] w-full text-center relative z-20"
                            role="textbox"
                            spellCheck
                            data-lexical-editor
                            contentEditable
                            aria-multiline
                            dir="ltr"
                            onInput={(e) =>
                              setInputText(
                                (e.target as HTMLDivElement).innerText,
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:hidden block">
                  <Footer onCreate={handleCreate} onDiscard={handleDiscard} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full p-4">
              <div className="flex justify-center items-center gap-5">
                {[
                  { id: 1, title: "Create a photo story", icon: Images },
                  { id: 2, title: "Create a text story", icon: ALargeSmall },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleClick(item.id)}
                    className={`aspect-2/3 rounded-sm bg-linear-to-tr flex flex-col justify-center items-center w-full h-full hover:opacity-90 p-6 cursor-pointer ${
                      i === 0
                        ? "from-purple-600 via-blue-500 to-indigo-600"
                        : "from-rose-500 via-red-400 to-purple-500"
                    }`}
                  >
                    {i === 0 && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        className="w-full h-full"
                        onChange={(e) => {
                          setImage(e.target.files?.[0]);
                          setIsEditing(true);
                        }}
                      />
                    )}
                    <div className="w-[25%] aspect-square bg-accent rounded-full flex justify-center items-center">
                      <item.icon size={20} />
                    </div>
                    <h1 className="font-bold text-accent text-center">
                      {item.title}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Footer = ({
  onDiscard,
  onCreate,
  className,
}: {
  onDiscard: () => void;
  onCreate: () => void;
  className?: string;
}) => {
  const [createStory, { isLoading }] = useCreateStoryMutation();
  const router = useRouter();
  return (
    <div className={cn("grid grid-cols-2 gap-3 items-center ", className)}>
      <Button
        disabled={isLoading}
        onClick={() => onDiscard()}
        variant={"secondary"}
        className=""
      >
        Discard
      </Button>
      <Button disabled={isLoading} className="" onClick={() => onCreate()}>
        Share to story
      </Button>
    </div>
  );
};

export default CreateStoryPage;
