import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseSensitive } from "lucide-react";
import { BackgroundSelector } from "./background-selector";

export const TextEditorSidebar = ({ selectedColor, setSelectedColor }: any) => (
  <div className="p-4 w-full space-y-4">
    <Select defaultValue="clean">
      <SelectTrigger className="w-full h-14! justify-start gap-2">
        <CaseSensitive />
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="clean">Clean</SelectItem>
        <SelectItem value="casual">Casual</SelectItem>
        <SelectItem value="fancy">Fancy</SelectItem>
        <SelectItem value="headline">Headline</SelectItem>
      </SelectContent>
    </Select>

    <div className="border rounded-md p-4">
      <h1>Backgrounds</h1>
      <BackgroundSelector
        type="gradient"
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <BackgroundSelector
        type="color"
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>

    <div className="border rounded-md p-4">
      <h1>Text Color</h1>
      <input
        type="color"
        value={selectedColor.textColor}
        onChange={(e) =>
          setSelectedColor((prev: any) => ({
            ...prev,
            textColor: e.target.value,
          }))
        }
      />
    </div>
  </div>
);
