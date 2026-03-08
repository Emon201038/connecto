import Image from "next/image";
import { TextEditor } from "./text-editor";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

export const MainContent = ({
  isEditing,
  isTextMode,
  image,
  position,
  rotation,
  parentRef,
  editorRef,
  inputText,
  setInputText,
  handleMouseDown,
  storyOptions,
  handleClick,
  onDiscard,
  onCreate,
}: any) => (
  <div className="flex-1 bg-shade">
    {isEditing ? (
      <div className="h-[calc(100vh-3.5rem)] mt-14 mb-6 flex flex-col justify-center items-center px-8 md:py-8 py-4">
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
                <TextEditor
                  parentRef={parentRef}
                  editorRef={editorRef}
                  position={position}
                  rotation={rotation}
                  inputText={inputText}
                  setInputText={setInputText}
                  handleMouseDown={handleMouseDown}
                />
              )}
            </div>
          </div>
          <div className="md:hidden block">
            <Footer onCreate={onCreate} onDiscard={onDiscard} />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-full p-4">
        <div className="flex justify-center items-center gap-5 w-full max-w-4xl">
          {storyOptions.map((item: any, i: number) => (
            <div
              key={i}
              onClick={() => handleClick(item.id)}
              className={cn(
                "aspect-2/3 rounded-sm bg-linear-to-tr flex flex-col justify-center items-center w-full h-full hover:opacity-90 p-6 cursor-pointer",
                i === 0
                  ? "from-purple-600 via-blue-500 to-indigo-600"
                  : "from-rose-500 via-red-400 to-purple-500",
              )}
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
);
