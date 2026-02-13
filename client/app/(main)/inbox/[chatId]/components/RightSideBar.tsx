"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { messengerThemes } from "@/constants/themes";
import { toggleOpenRightSidebar } from "@/redux/features/conversation/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ALargeSmall,
  ArrowLeft,
  Bell,
  ChevronDown,
  CircleDot,
  ImageIcon,
  Search,
  UserCircle2,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  useGetConversationInfoQuery,
  useUpdateEmojiMutation,
} from "@/redux/features/conversation/conversationApi";
import CustomEmojiPicker from "@/components/EmojiPicker";

const RightSideBar = () => {
  const [openEmojiModal, setOpenEmojiModal] = React.useState(false);
  const { openRightSidebar } = useAppSelector((state) => state.conversation);
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(toggleOpenRightSidebar());
  };
  const router = useRouter();
  const params = useParams<{ chatId: string }>();

  const {
    data: conversation,
    isLoading,
    error,
  } = useGetConversationInfoQuery({
    id: params.chatId,
  });
  const theme =
    messengerThemes.find(
      (t) => t.id.toLowerCase() === conversation?.theme.toLowerCase()
    ) || messengerThemes[0];
  const [updateEmoji] = useUpdateEmojiMutation();

  // if (isLoading) return <RightSideBarLoader />;

  if (!openRightSidebar) return null;

  return (
    <div className="w-full md:max-w-[360px] md:min-w-[300px] p-4 flex flex-col bg-background rounded-sm relative">
      <Button
        onClick={handleClick}
        variant="ghost"
        className="absolute top-4 left-4"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage
            src={
              conversation?.conversation?.avatar ||
              "/images/default-profile.jpeg"
            }
          />
          <AvatarFallback>{conversation?.nickname.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{conversation?.nickname}</h2>
        {/* <p className="text-sm text-muted-foreground">Active now</p> */}
      </div>
      <div className="flex justify-center space-x-4 mb-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-0 size-9 rounded-full bg-shade"
            onClick={() => router.push(`/${conversation?.user?.username}`)}
          >
            <UserCircle2 className="size-[18px]" />
          </Button>
          <p className="text-sm">Profile</p>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-0 size-9 rounded-full bg-shade"
          >
            <Bell className="size-[18px]" />
          </Button>
          <p className="text-sm">Mute</p>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-0 size-9 rounded-full bg-shade"
          >
            <Search className="size-[18px]" />
          </Button>
          <p className="text-sm">Search</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4 w-full">
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold text-sm">Customise chat</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="flex gap-2 items-center cursor-pointer hover:bg-secondary-btn-bg p-2 rounded-sm">
              <div className="rounded-full !aspect-square w-9 h-9 bg-shade flex justify-center items-center">
                <div
                  style={{ backgroundColor: theme.colors.accent }}
                  className="size-5 aspect-square rounded-full flex justify-center items-center"
                >
                  <CircleDot
                    size={20}
                    color="currentColor"
                    className="text-white dark:text-black"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm">Change theme</h3>
            </div>
            <Dialog open={openEmojiModal} onOpenChange={setOpenEmojiModal}>
              <DialogTrigger asChild>
                <div
                  onClick={() => setOpenEmojiModal(true)}
                  className="flex gap-2 items-center cursor-pointer hover:bg-secondary-btn-bg p-2 rounded-sm"
                >
                  <div className="rounded-full !aspect-square w-9 h-9 bg-muted flex justify-center items-center">
                    <div
                      // style={{ backgroundColor: theme.colors.accent }}
                      className="size-5 aspect-square rounded-full flex justify-center items-center"
                    >
                      {/* <Image
                        src={`/images/${conversation.emoji.toLowerCase()}.svg`}
                        width={20}
                        height={20}
                        alt="emoji"
                      /> */}
                      <Like />
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">Change emoji</h3>
                </div>
              </DialogTrigger>
              <DialogContent className="p-8">
                <DialogTitle className="sr-only">Change emoji</DialogTitle>
                <DialogDescription className="sr-only">
                  Choose emoji to use in chat
                </DialogDescription>
                <CustomEmojiPicker
                  onPick={async (e) => {
                    setOpenEmojiModal(false);
                    await updateEmoji({
                      id: params.chatId as string,
                      emoji: e.unified,
                    });
                  }}
                  style={{ width: "100%" }}
                  open={openEmojiModal}
                />
              </DialogContent>
            </Dialog>
            <div className="flex gap-2 items-center cursor-pointer hover:bg-secondary-btn-bg p-2 rounded-sm">
              <div className="rounded-full !aspect-square w-9 h-9 bg-muted flex justify-center items-center">
                <div
                  // style={{ backgroundColor: theme.colors.accent }}
                  className="size-5 aspect-square rounded-full flex justify-center items-center"
                >
                  <ALargeSmall size={20} />
                </div>
              </div>
              <h3 className="font-semibold text-sm">Edit nicknames</h3>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <span>Media, files and links</span>
          </div>
          <ChevronDown className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span>Privacy and support</span>
          </div>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export const Like = ({
  width = 20,
  height = 20,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <svg
      aria-hidden="true"
      height={height}
      viewBox="0 0 22 23"
      width={width}
      className={className}
    >
      <path
        d="M10.987 0c1.104 0 3.67.726 3.67 5.149 0 1.232-.123 2.001-.209 2.534a16.11 16.11 0 00-.048.314l-.001.005a.36.36 0 00.362.406c4.399 0 6.748 1.164 6.748 2.353 0 .533-.2 1.02-.527 1.395a.11.11 0 00.023.163 2.13 2.13 0 01.992 1.79c0 .86-.477 1.598-1.215 1.943a.11.11 0 00-.046.157c.207.328.329.713.329 1.128 0 .946-.547 1.741-1.406 2.029a.109.109 0 00-.068.137c.061.184.098.38.098.584 0 1.056-1.776 1.913-5.95 1.913-3.05 0-5.154-.545-5.963-.936-.595-.288-1.276-.81-1.276-2.34v-6.086c0-1.72.958-2.87 1.911-4.014C9.357 7.49 10.3 6.36 10.3 4.681c0-1.34-.091-2.19-.159-2.817-.039-.368-.07-.66-.07-.928 0-.527.385-.934.917-.936zM3.5 11h-2C.5 11 0 13.686 0 17s.5 6 1.5 6h2a1 1 0 001-1V12a1 1 0 00-1-1z"
        fill="#4e4bf5"
      ></path>
    </svg>
  );
};

export default RightSideBar;
