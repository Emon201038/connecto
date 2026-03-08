import Profile from "@/app/story/create/profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ALargeSmall, Settings } from "lucide-react";
import { TextEditorSidebar } from "./text-editor-sidebar";
import { Footer } from "./footer";

export const LeftSidebar = ({
  isEditing,
  isTextMode,
  image,
  selectedColor,
  setSelectedColor,
  inputText,
  onDiscard,
  onCreate,
}: {
  isEditing: boolean;
  isTextMode: boolean;
  image?: File;
  selectedColor: any;
  setSelectedColor: any;
  inputText: string;
  onDiscard: () => void;
  onCreate: () => void;
}) => (
  <div className="w-90 h-full shadow-[1px_0px_12px_-4px_rgba(0,0,0,0.3)] hidden md:block bg-normal">
    <div className="w-full mt-16">
      <div className="flex justify-between items-center w-full p-4">
        <h1 className="font-bold text-2xl">Your Story</h1>
        <Button
          className="size-9 rounded-full bg-secondary-btn-bg text-secondary-btn-text"
          variant="ghost"
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
        <TextEditorSidebar
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      )}
      {isEditing && (
        <Footer
          onDiscard={onDiscard}
          onCreate={onCreate}
          className="fixed bottom-0 left-0 w-90 shadow-[0px_1px_12px_-4px_rgba(0,0,0,0.3)] p-3"
        />
      )}
    </div>
  </div>
);
