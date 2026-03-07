"use client";
import GridIcon from "@/components/icons/GridIcon";
import { ProfilePopover } from "@/components/profile-popover";
import ReusableTooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ALargeSmall, Bell, Images, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import Profile from "./profile";
import { cn } from "@/lib/utils";
import { useCreateStoryMutation } from "@/redux/features/story/storyApi";
import { useRouter } from "next/navigation";

const CreateStoryPage = () => {
  const [image, setImage] = React.useState<File>();
  const handleClick = (id: number) => {
    if (id === 2) {
      toast.info("This feature is not available yet.");
    } else {
      const inputField = document.createElement("input");
      inputField.type = "file";
      inputField.accept = "image/*";
      inputField.click();

      inputField.onchange = () => {
        const file = inputField.files?.[0];
        if (file) {
          setImage(file);
        }
      };
    }
  };

  return (
    <div className="w-full h-screen">
      {/* header */}
      <div className="flex justify-between items-center gap-2 h-14 px-4 fixed top-0 left-0 w-full bg-transparent z-10">
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
      </div>
      <Separator className="!w-[360px] fixed top-14 md:block hidden" />
      <div className="flex w-full h-full">
        {/* left sidebar */}
        <div className="w-[360px] h-full shadow-[1px_0px_12px_-4px_rgba(0,0,0,0.3)] hidden md:block relative">
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
          </div>
          {image && (
            <Footer
              image={image}
              setImage={setImage}
              className="fixed bottom-0 left-0 w-[360px] shadow-[0px_1px_12px_-4px_rgba(0,0,0,0.3)] p-3"
            />
          )}
        </div>
        <div className="flex-1">
          {image ? (
            <div className="  h-[calc(100vh-3.5rem)] mt-14 mb-6 flex flex-col justify-center items-center px-8 md:py-8 py-4">
              <div className="rounded-md shadow-[1px_1px_12px_-4px_rgba(0,0,0,0.3)] w-full h-full p-4 flex flex-col gap-3">
                <p className="text-left w-full">Preview</p>
                <div className="flex-1 rounded-md shadow-[1px_1px_12px_-4px_rgba(0,0,0,0.3)] bg-[#18191a] p-3 flex justify-center items-center">
                  <div className="aspect-[2/3] h-full relative border rounded-sm">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="logo"
                      fill
                      className="w-full h-full object-contain z-10"
                    />
                  </div>
                </div>
                <Footer
                  image={image}
                  setImage={setImage}
                  className="md:hidden"
                />
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
                    className={`aspect-[2/3] rounded-sm bg-gradient-to-tr flex flex-col justify-center items-center w-full h-full hover:opacity-90 p-6 cursor-pointer ${
                      i === 0
                        ? "from-purple-600 via-blue-500 to-indigo-600"
                        : "from-rose-500 via-red-400 to-purple-500"
                    }`}
                  >
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
  image,
  setImage,
  className,
}: {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  className?: string;
}) => {
  const [createStory, { isLoading }] = useCreateStoryMutation();
  const router = useRouter();
  const shareStory = async () => {
    if (!image) return;
    const toastId = toast.loading("Creating story...");
    try {
      const res = await createStory({ image }).unwrap();
      if (res?.data?.id) {
        toast.success("Story created successfully", { id: toastId });
        setImage(undefined);
        router.push(`/`);
      } else {
        toast.error("Failed to create story", {
          id: toastId,
          description: res?.errors?.[0]?.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create story", { id: toastId });
    }
  };
  return (
    <div className={cn("grid grid-cols-2 gap-3 items-center ", className)}>
      <Button
        disabled={isLoading}
        onClick={() => setImage(undefined)}
        variant={"secondary"}
        className=""
      >
        Discard
      </Button>
      <Button disabled={isLoading} className="" onClick={shareStory}>
        Share to story
      </Button>
    </div>
  );
};

export default CreateStoryPage;
