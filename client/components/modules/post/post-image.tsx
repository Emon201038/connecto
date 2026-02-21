import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ImageGrid = ({
  attachments,
}: {
  attachments: { url: string; pub_id: string }[];
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const renderImageGrid = () => {
    const count = attachments.length;

    if (count === 1) {
      return (
        <div
          className="relative w-full max-h-125 overflow-hidden cursor-pointer"
          onClick={() => setSelectedImage(attachments[0].url)}
        >
          <Image
            src={attachments[0].url || "/placeholder.svg"}
            alt="Post image"
            width={600}
            height={400}
            placeholder="blur"
            blurDataURL={
              "https://res.cloudinary.com/emadul-hoque-emon/image/upload/e_blur:10000,q_1,q_auto:low,f_webp/v1757695325/facebook/post/dmrgspqrq8knztdrw6wj.png"
            }
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-0 overflow-hidden max-h-100">
          {attachments.slice(0, 2).map((attachment, index) => (
            <div
              key={attachment.pub_id}
              className="relative aspect-square overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(attachment.url)}
            >
              <Image
                src={attachment.url || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 overflow-hidden max-h-100">
          <div
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(attachments[0].url)}
          >
            <Image
              src={attachments[0].url || "/placeholder.svg"}
              alt="Post image 1"
              fill
              className="object-cover hover:opacity-95 transition-opacity"
            />
          </div>
          <div className="grid grid-rows-2 gap-1">
            {attachments.slice(1, 3).map((attachment, index) => (
              <div
                key={attachment.pub_id}
                className="relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(attachment.url)}
              >
                <Image
                  src={attachment.url || "/placeholder.svg"}
                  alt={`Post image ${index + 2}`}
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (count >= 4) {
      return (
        <div className="grid grid-cols-2 gap-1 overflow-hidden max-h-100">
          {attachments.slice(0, 3).map((attachment, index) => (
            <div
              key={attachment.pub_id}
              className={cn(
                "relative overflow-hidden cursor-pointer",
                index === 0 ? "aspect-square" : "aspect-4/3",
              )}
              onClick={() => setSelectedImage(attachment.url)}
            >
              <Image
                src={attachment.url || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          ))}
          <div
            className="relative aspect-4/3 overflow-hidden cursor-pointer bg-black/50"
            onClick={() => setSelectedImage(attachments[3].url)}
          >
            <Image
              src={attachments[3].url || "/placeholder.svg"}
              alt="Post image 4"
              fill
              className="object-cover"
            />
            {count > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  +{count - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="w-full">{renderImageGrid()}</div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Full size image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGrid;
