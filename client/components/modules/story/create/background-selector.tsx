import { STORY_BACKGROUNDS } from "@/constants/themes";

export const BackgroundSelector = ({
  type,
  selectedColor,
  setSelectedColor,
}: any) => {
  const backgrounds = STORY_BACKGROUNDS.filter((bg) => bg.type === type);
  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {backgrounds.map((bg) => (
        <div
          key={bg.id}
          className="size-8 rounded-full flex justify-center items-center cursor-pointer"
          style={{
            background:
              bg.type === "gradient"
                ? `linear-gradient(135deg, ${bg.colors!.join(",")})`
                : bg.color,
            border: bg.id === selectedColor.id ? "4px solid #0274f9" : "",
            scale: bg.id === selectedColor.id ? "1.2" : "1",
          }}
          onClick={() => setSelectedColor(bg)}
        />
      ))}
    </div>
  );
};
